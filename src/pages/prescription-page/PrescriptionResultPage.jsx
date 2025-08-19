import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useUser } from "@contexts/UserContext";

import Right from "@assets/images/white_chevron_right.svg";

import TextButton from "@components/commons/TextButton.jsx";

const PrescriptionResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useUser();

    const { analysisResult } = location.state || {};

    // 결과가 없으면 업로드 페이지로 리다이렉트
    if (!analysisResult) {
        navigate('/prescription/upload');
        return null;
    }

    return (
        <div className="px-5 pt-9.5">
            <div className="flex justify-center items-center mb-6">
                <p className="text-xl font-semibold whitespace-pre-line text-center">
                    {t('prescription.result.titleParts.part1')}
                    {user && <span className="text-green-500 font-semibold">{user.name}</span>}
                    {t('prescription.result.titleParts.part2')}
                </p>
            </div>

            <div 
                className="rounded-sm p-4 border-[1px] mb-20 border-[#D3D4D4] h-110 text-sm text-gray-700 leading-relaxed overflow-y-auto no-scrollbar">
                <div className="whitespace-pre-line">
                    {analysisResult}
                </div>
            </div>
            <TextButton text="통역 채팅 시작하기" icon={Right} />
            
        </div>
    );
};

export default PrescriptionResultPage;