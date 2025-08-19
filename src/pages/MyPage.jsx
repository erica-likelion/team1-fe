/* 마이페이지 */

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import HistoryDiv from "@components/commons/HistoryDiv";
import { getCallHistory, getPrecheckHistory, getPrescriptionHistory } from "@apis/historyApi";

import Call from "@assets/images/call.svg";
import Doctor from "@assets/images/doctor.svg";
import Medicine from "@assets/images/medicine.svg";
import { useUser } from "@contexts/UserContext";

const MyPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user } = useUser();
    const language = i18n.language;

    const [callHistory, setCallHistory] = useState([]);
    const [diagnosisHistory, setDiagnosisHistory] = useState([]);
    const [prescriptionHistory, setPrescriptionHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    
    // 컴포넌트 마운트 시 모든 히스토리 데이터 로드
    useEffect(() => {
        const loadHistoryData = async () => {
            try {
                setLoading(true);
                
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
                setLoading(false);
            }
        };

        loadHistoryData();
    }, []);

    const UserName = () => {
        if (!user) return null;
        
        return (
            <>
                {language === "en" ? 
                <>
                    <p>
                        {user.gender === "M" ? t('mypage.suffixMale'): t('mypage.suffixFemale')}
                    </p>
                    <span className="font-bold">{user.name}</span>
                </>: 
                <>
                    <span className="font-bold">{user.name}</span>
                    <p>
                        {user.gender === "M" ? t('mypage.suffixMale'): t('mypage.suffixFemale')}
                    </p>
                </>}
            </>
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