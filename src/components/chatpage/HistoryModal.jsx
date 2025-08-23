import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ServiceCard from "@components/commons/ServiceCard";
import { getPrecheckHistory } from "@apis/precheckApi";
import { getPrescriptionHistory } from "@apis/prescriptionApi";

import Close from "@assets/images/close.svg"; 
import Doctor from "@assets/images/doctor.svg";
import Medicine from "@assets/images/medicine.svg";
import Loading from "@assets/images/loading.svg";

const HistoryModal = ({
    onClose,
    title,
    historyType,
    icon,
    onSelectHistory
}) => {
    const { t } = useTranslation();
    const [historyList, setHistoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // API 함수 매핑을 useMemo로 최적화
    const apiFunction = useMemo(() => {
        return historyType === 'precheck' ? getPrecheckHistory : getPrescriptionHistory;
    }, [historyType]);

    // 아이콘 매핑을 useMemo로 최적화
    const modalIcon = useMemo(() => {
        return icon || (historyType === "precheck" ? Doctor : Medicine);
    }, [icon, historyType]);

    // fetchHistoryData를 useCallback으로 메모이제이션
    const fetchHistoryData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await apiFunction();
            setHistoryList(data || []);
        } catch (error) {
            console.error(`Failed to fetch ${historyType} history:`, error);
            setError(error.message || `Failed to load ${historyType} history`);
            setHistoryList([]);
        } finally {
            setIsLoading(false);
        }
    }, [apiFunction, historyType]);

    // 모달이 열릴 때만 API 호출 및 애니메이션 시작
    useEffect(() => {
        fetchHistoryData();
        // 모달이 마운트된 후 약간의 지연을 두고 애니메이션 시작
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10);
        
        return () => clearTimeout(timer);
    }, [fetchHistoryData]);

    // 모달 닫기 애니메이션 처리
    const handleClose = useCallback(() => {
        setIsVisible(false);
        // 애니메이션이 완료된 후 모달 닫기
        setTimeout(() => {
            onClose();
        }, 300);
    }, [onClose]);

    const handleCardClick = (historyId) => {
        if (onSelectHistory) {
            onSelectHistory(historyId);
        }
    }

    return (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-[375px] w-full bg-transparent z-100">
            <div className={`bg-white p-5 max-w-[375px] mx-auto shadow-[0_-2px_4px_0_rgba(0,0,0,0.10)] rounded-t-xl transition-transform duration-300 ease-out ${
                isVisible ? 'translate-y-0' : 'translate-y-full'
            }`}>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold">{title}</p>
                    <img className="cursor-pointer" src={Close} onClick={handleClose}/>
                </div>
                {isLoading ? 
                 <div className="h-[40vh]">
                <img src={Loading} className="animate-spin fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                    <p className="max-w-[375px] text-[#A6A9AA] font-semibold fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-18">
                        {t('prescription.scanning.wait')}
                    </p>
                </div>
                :(
                <div className="h-[40vh] overflow-auto no-scrollbar">
                    {historyList.map((history) => (
                            <div key={history.id}>
                                <ServiceCard 
                                    icon={modalIcon}
                                    title={history.title}
                                    description={history.createdAt}
                                    onClick={() => handleCardClick(history.id)}
                                    className="shadow-none"
                                />
                                <div className="my-0.5 border-b-1 border-[#E9E9EA]" />
                            </div>
                        ))}
                </div>)}
            </div>
        </div>
    );
};

export default HistoryModal;