import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useUser } from "@contexts/UserContext";

import Loading from "@assets/images/loading.svg";

const CallLoadingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { user } = useUser();
    const language = i18n.language;
    
    // 전달받은 예약 정보
    const reservationInfo = location.state || {};
    const { userName, selectedDate, selectedTime } = reservationInfo;



    return (
        <div className="flex flex-col items-center px-5 mt-25">
            <div className="text-center">
                <p className="text-xl font-semibold whitespace-pre-line">
                    {t('call.loading.messageParts.part1')}
                    {user && <span className="text-[#3DE0AB] font-semibold">{user.name}</span>}
                    {t('call.loading.messageParts.part2')}
                </p>
                
                <img src={Loading} className="animate-spin fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                <p className="text-[#A6A9AA] font-semibold fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-18">
                    {t('prescription.scanning.wait')}
                </p>
            </div>
        </div>
    );
};

export default CallLoadingPage;