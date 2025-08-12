import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getUserName } from "@utils/userUtils";

const PrescriptionResultPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const userName = getUserName();

    const handleRetry = () => {
        navigate('/prescription/upload');
    };

    const handleComplete = () => {
        navigate('/home');
    };

    return (
        <div className="px-6 py-8">
            <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">{t('prescription.result.title')}</h2>
                <p className="text-sm text-gray-600 mb-6 whitespace-pre-line">
                    {t('prescription.result.subtitleParts.part1')}
                    <span className="text-green-500 font-semibold">{userName}</span>
                    {t('prescription.result.subtitleParts.part2')}
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-4">{t('prescription.result.analysisTitle')}</h3>
                <div className="bg-white rounded-lg p-4 min-h-[200px] text-sm text-gray-700 leading-relaxed">
                    <p className="mb-3">
                        <strong>처방 의약품:</strong> 타이레놀정 500mg, 게보린정
                    </p>
                    <p className="mb-3">
                        <strong>용법·용량:</strong> 타이레놀정은 1회 1정, 1일 3회 식후 복용하시고, 게보린정은 1회 1정, 1일 2회 아침·저녁 식후 복용하세요.
                    </p>
                    <p className="mb-3">
                        <strong>주의사항:</strong> 타이레놀정은 간 기능에 영향을 줄 수 있으니 음주를 피하시고, 게보린정은 위장장애가 있을 수 있으니 식후 복용해주세요.
                    </p>
                    <p className="text-red-600">
                        <strong>부작용:</strong> 발진, 가려움, 소화불량 등이 나타날 수 있으며, 증상이 지속되면 의사와 상담하세요.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <button 
                    onClick={handleComplete}
                    className="w-full py-4 bg-green-500 text-white font-medium rounded-lg"
                >
                    {t('prescription.buttons.home')}
                </button>
                
                <button 
                    onClick={handleRetry}
                    className="w-full py-4 border border-green-500 text-green-500 font-medium rounded-lg"
                >
                    {t('prescription.buttons.retry')}
                </button>
            </div>
        </div>
    );
};

export default PrescriptionResultPage;