import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import HistoryDiv from "@components/historypage/HistoryDiv";
import { fetchCallHistory, fetchPrecheckHistory, fetchPrescriptionHistory } from "@apis/historyApi";

import Call from "@assets/images/logo.svg";
import Doctor from "@assets/images/logo.svg";
import Medicine from "@assets/images/logo.svg";

const HistoryPage = () => {
    const { t } = useTranslation();
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
                    fetchCallHistory(),
                    fetchPrecheckHistory(),
                    fetchPrescriptionHistory()
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">히스토리를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6">
            <HistoryDiv 
                title={t('history.titles.callHistory')} 
                icon={Call} 
                historyList={callHistory}
            />
            <HistoryDiv 
                title={t('history.titles.diagnosisHistory')} 
                icon={Doctor} 
                historyList={diagnosisHistory}
            />
            <HistoryDiv 
                title={t('history.titles.prescriptionHistory')} 
                icon={Medicine} 
                historyList={prescriptionHistory}
            />
        </div>
    )
}

export default HistoryPage;