import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getUserName } from "@utils/userUtils";

import Right from "@assets/images/white_chevron_right.svg";

import TextButton from "@components/commons/TextButton.jsx";

const PrescriptionResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const userName = getUserName();
    const [showKoreanContent, setShowKoreanContent] = useState(false);

    const { analysisResult, originalImage } = location.state || {};

    // 결과가 없으면 업로드 페이지로 리다이렉트
    if (!analysisResult) {
        navigate('/prescription/upload');
        return null;
    }

    const handleRetry = () => {
        navigate('/prescription/upload');
    };

    useEffect(() => {
        // 스크롤바 숨김 스타일 추가
        const style = document.createElement('style');
        style.textContent = `
            .hide-scrollbar::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="px-5 pt-9.5">
            <div className="flex justify-center items-center mb-6">
                <p className="text-xl font-semibold whitespace-pre-line text-center">
                    {t('prescription.result.titleParts.part1')}
                    <span className="text-green-500 font-semibold">{userName}</span>
                    {t('prescription.result.titleParts.part2')}
                </p>
            </div>

            <div 
                className="rounded-sm p-4 border-[1px] mb-20 border-[#D3D4D4] h-110 text-sm text-gray-700 leading-relaxed overflow-y-auto hide-scrollbar"
                style={{
                    scrollbarWidth: 'none', /* Firefox */
                    msOverflowStyle: 'none' /* IE and Edge */
                }}
            >
                <div className="whitespace-pre-line">
                    {showKoreanContent && analysisResult.koreanContent 
                        ? analysisResult.koreanContent 
                        : analysisResult.content
                    }
                </div>
            </div>
            <TextButton text="통역 채팅 시작하기" icon={Right} />
            
        </div>
    );
};

export default PrescriptionResultPage;