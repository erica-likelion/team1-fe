import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import HistoryDiv from '@components/mypage/HistoryDiv';
import { getPrecheckHistory, getPrescriptionHistory } from '@apis/historyApi';

import Close from "@assets/images/close.svg"; 
import Doctor from "@assets/images/doctor.svg";
import Medicine from "@assets/images/Medicine.svg";

const HistoryModal = ({
    onClose,
    title,
    historyType,
    icon,
    onSelectHistory
}) => {
    const { t } = useTranslation();
    const [historyList, setHistoryList] = useState([]);

    // API 함수 매핑을 useMemo로 최적화
    const apiFunction = useMemo(() => {
        return historyType === 'precheck' ? getPrecheckHistory : getPrescriptionHistory;
    }, [historyType]);

    // 아이콘 매핑을 useMemo로 최적화
    const modalIcon = useMemo(() => {
        return icon || (historyType === "precheck" ? Doctor : Medicine);
    }, [icon, historyType]);

    // 아이콘 매핑을 useMemo로 최적화
    const modalTitle = useMemo(() => {
        return historyType === "precheck" ? t('mypage.history.titles.diagnosisHistory') : t('mypage.history.titles.prescriptionHistory');
    }, [historyType]);

    // fetchHistoryData를 useCallback으로 메모이제이션
    const fetchHistoryData = useCallback(async () => {
        try {
            const data = await apiFunction();
            setHistoryList(data || []);
        } catch (error) {
            console.error(`Failed to fetch ${historyType} history:`, error);
            setError(error.message || `Failed to load ${historyType} history`);
            setHistoryList([]);
        } 
    }, [apiFunction, historyType]);

    // 모달이 열릴 때만 API 호출
    useEffect(() => {
        fetchHistoryData();
    }, [fetchHistoryData]);

    // 배경 클릭으로 모달 닫기
    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 max-h-[90vh] overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-center mb-4">
                    <p id="modal-title" className="text-lg font-semibold">{title}</p>
                    <img className="cursor-pointer" src={Close} onClick={onClose}/>
                </div>

                <HistoryDiv
                    title={modalTitle}
                    historyList={historyList}
                    icon={modalIcon}
                    onSelectHistory={onSelectHistory}
                />
            </div>
        </div>
    );
};

export default HistoryModal;