import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useUser } from "@contexts/UserContext";
import { useTreatInfo } from "@contexts/TreatInfoContext";

import Loading from "@assets/images/loading.svg";

const TreantInfoScanningPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { user } = useUser();
    const { formData, submitTreatInfo, isLoading, result, error } = useTreatInfo();

    const language = i18n.language;

    //페이지 로드시 API 호출
    useEffect(() => {
        const callAPI = async () => {
            try {
                //console.log('사전문진 API 호출 시작:', formData);
                await submitTreatInfo(language);
                // 성공시 결과 페이지로 이동 (3초 후)
                setTimeout(() => {
                    navigate('/treat-info/result');
                }, 3000);
            } catch (err) {
                //console.error('사전문진 API 호출 실패:', err);
                // 에러시에도 결과 페이지로 이동 (에러 표시용)
                setTimeout(() => {
                    navigate('/treat-info/result');
                }, 2000);
            }
        };

        callAPI();
    }, []);


    return (
        <div className="flex flex-col items-center px-5 mt-25 max-w-[375px] mx-auto">
            <div className="text-center">
                <p className="text-xl font-semibold whitespace-pre-line">
                    {t('precheck.scanning.messageParts.part1')}
                    <span className="text-[#3DE0AB] font-semibold">{user ? user.name : t('user.defaultName')}</span>
                    {t('precheck.scanning.messageParts.part2')}
                </p>
                
                <img src={Loading} alt="loading" className="animate-spin fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                <p className="max-w-[375px] text-[#A6A9AA] font-semibold fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-18">
                    {t('precheck.scanning.wait')}
                </p>
            </div>
        </div>
    );
};

export default TreantInfoScanningPage;