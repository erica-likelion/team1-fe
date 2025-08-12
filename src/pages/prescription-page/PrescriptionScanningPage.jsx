import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getUserName } from "@utils/userUtils";

const PrescriptionScanningPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const userName = getUserName();

    useEffect(() => {
        // 3초 후 결과 페이지로 이동 (실제로는 스캔 완료 후)
        const timer = setTimeout(() => {
            navigate('/prescription/result');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="px-6 py-8 h-full flex flex-col justify-center items-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                
                <h2 className="text-lg font-bold mb-2">{t('prescriptionGuide.scanning.title')}</h2>
                
                <p className="text-sm text-gray-600 mb-8 whitespace-pre-line">
                    {t('prescriptionGuide.scanning.messageParts.part1')}
                    <span className="text-green-500 font-semibold">{userName}</span>
                    {t('prescriptionGuide.scanning.messageParts.part2')}
                </p>
                
                <p className="text-xs text-gray-500">
                    {t('prescriptionGuide.scanning.wait')}
                </p>
            </div>
        </div>
    );
};

export default PrescriptionScanningPage;