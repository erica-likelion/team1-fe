/* 마이페이지 */

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import HistoryDiv from "@components/commons/HistoryDiv";
import { getCallHistory } from "@apis/callApi";
import { getPrecheckHistory } from "@apis/precheckApi";
import { getPrescriptionHistory } from "@apis/prescriptionApi";

import Call from "@assets/images/call.svg";
import Doctor from "@assets/images/doctor.svg";
import Medicine from "@assets/images/medicine.svg";
import Loading from "@assets/images/loading.svg";
import { useUser } from "@contexts/UserContext";

const MyPage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useUser();
    const language = i18n.language;

    const [callHistory, setCallHistory] = useState([]);
    const [diagnosisHistory, setDiagnosisHistory] = useState([]);
    const [prescriptionHistory, setPrescriptionHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    
    // 컴포넌트 마운트 시 모든 히스토리 데이터 로드
    useEffect(() => {
        const loadHistoryData = async () => {
            try {
                setIsLoading(true);
                
                // 모든 API를 병렬로 호출
                const [callData, diagnosisData, prescriptionData] = await Promise.all([
                    getCallHistory(),
                    getPrecheckHistory(),
                    getPrescriptionHistory()
                ]);

                setCallHistory(callData);
                setDiagnosisHistory(diagnosisData);
                setPrescriptionHistory(prescriptionData);
            } catch (err) {
                console.error('히스토리 데이터 로드 실패:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadHistoryData();
    }, []);

    const UserName = () => {
        return (
            <>
                {language === "en" ? 
                <>
                    <p>
                        {user?.gender === "M" ? t('mypage.suffixMale'): t('mypage.suffixFemale')}
                    </p>
                    <span className="font-bold">{user ? user.name : t('user.defaultName')}</span>
                </>: 
                <>
                    <span className="font-bold">{user ? user.name : t('user.defaultName')}</span>
                    <p>
                        {user?.gender === "M" ? t('mypage.suffixMale'): t('mypage.suffixFemale')}
                    </p>
                </>}
            </>
        )
    }

    if (isLoading) {
        return (
            <div>
                <img src={Loading} alt="loading" className="animate-spin fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                <p className="max-w-[375px] text-[#A6A9AA] font-semibold fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-18">
                    {t('prescription.scanning.wait')}
                </p>
            </div>
        )
    }

    return (
        <div className="px-5">
            <div className="flex justify-start items-center text-[28px] h-25 my-3">
                    <UserName />
            </div>
            <div className="mx-[-20px] w-[375px] h-2 bg-[#E9E9EA] mb-10"></div>
            <div className="space-y-6 my-6">
                <HistoryDiv 
                    title={t('mypage.history.titles.callHistory')} 
                    icon={Call} 
                    historyList={callHistory}
                />
                <HistoryDiv 
                    title={t('mypage.history.titles.diagnosisHistory')} 
                    icon={Doctor} 
                    historyList={diagnosisHistory}
                />
                <HistoryDiv 
                    title={t('mypage.history.titles.prescriptionHistory')} 
                    icon={Medicine} 
                    historyList={prescriptionHistory}
                />
            </div>
        </div>
    );
};

export default MyPage;