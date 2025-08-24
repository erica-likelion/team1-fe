import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "@contexts/UserContext";
import { createChatRoom } from "@apis/chatApi";

import Right from "@assets/images/white_chevron_right.svg";

import TextButton from "@components/commons/TextButton.jsx";

import MarkdownRenderer from "@components/prescription/MarkdownRenderer";

const PrescriptionResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const { id, analysisResult } = location.state || {};

    // 결과가 없으면 업로드 페이지로 리다이렉트
    if (!analysisResult) {
        //navigate('/prescription/upload');
        //return null;
    }

    const handleChatStart = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const roomInfo = await createChatRoom({ type: "prescription", id});
            navigate(`/chat/${roomInfo.id}/${roomInfo.roomCode}`, {
                state: {
                    type: 'prescription'
                }
            });
        } catch(err) {
            console.log('채팅방 생성 실패: ', err);
            alert(t('common.tryAgain'));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="px-5 pt-9.5">
            <div className="flex justify-center items-center mb-6">
                <p className="text-xl font-semibold whitespace-pre-line text-center">
                    {t('prescription.result.titleParts.part1')}
                    <span className="text-green-500 font-semibold">{user ? user.name : t('user.defaultName')}</span>
                    {t('prescription.result.titleParts.part2')}
                </p>
            </div>

            <div className="rounded-sm p-4 border-[1px] mb-20 border-[#D3D4D4] h-110 overflow-y-auto no-scrollbar">
                <MarkdownRenderer>
                    {analysisResult ? analysisResult : t('prescription.result.placeholder')}
                </MarkdownRenderer>
            </div>
            <TextButton text={t('prescription.buttons.chat')} icon={Right} onClick={handleChatStart} />
            
        </div>
    );
};

export default PrescriptionResultPage;