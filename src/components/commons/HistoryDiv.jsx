import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import ServiceCard from "@components/commons/ServiceCard";
import TextButton from "@components/commons/TextButton";

import Close from "@assets/images/circle_close.svg";
import Right from "@assets/images/white_chevron_right.svg";

const HistoryDiv = ({
    title,
    historyList,
    icon,
    onSelectHistory = () => {},
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);

    // showAll 상태에 따라 표시할 리스트 결정 (기본 2개, 전체 보기 시 모든 항목)
    const reverseHistoryList = [...historyList].reverse();
    const displayedHistoryList = showAll ? reverseHistoryList  : reverseHistoryList.slice(0, 2);
    const handleCardClick = (history) => {
        if (onSelectHistory) {
            onSelectHistory(history.id);
        }
    }

    // TextButton 클릭 시 showAll 상태 토글
    const handleShowAllClick = () => {
        setShowAll(!showAll);
    }

    const relativeStyles = "relative bottom-auto left-auto transform-none translate-x-0 z-auto";

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <p className="font-semibold text-black">{title}</p>
                <TextButton 
                    text={showAll ? t('mypage.history.close') : t('mypage.history.viewAll')} 
                    icon={Right} 
                    onClick={handleShowAllClick} 
                    className={`!gap-1 !w-22 h-6.5 text-[12px] !p-0 font-medium ${relativeStyles} [&>img]:w-4 [&>img]:h-4`}
                />
            </div>
            {!displayedHistoryList.length ?
                <ServiceCard 
                    icon={Close} 
                    title={t('mypage.history.noneHistory.title')} 
                    description={t('mypage.history.noneHistory.description')}
                />
            :
                displayedHistoryList.map((history) => (
                    <ServiceCard 
                        key={history.id}
                        icon={icon} 
                        title={history.title} 
                        description={history.createdAt} 
                        onClick={() => handleCardClick(history)}
                    />
                ))
            }
        </div>
    )
}

export default HistoryDiv;