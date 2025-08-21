import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useUser } from "@contexts/UserContext";
import TextButton from "@components/commons/TextButton";
import GreenChevronRight from "@assets/images/green_chevron_right.svg";


const CallResultDeniedPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const { user } = useUser();

    const handleNext = () => {
            navigate('/home');
        
    };


    return (
        <div className="mt-15">
            <div className="flex items-center text-[20px] text-black font-medium leading-relaxed ml-15">
                {user?.name}님의 병원 예약이 
                <span className="text-[#3DE0AB] pl-1"> 반려</span>
                되었어요.
            </div>
        

            <TextButton
                text="홈으로 가기"
                onClick={handleNext}
                icon={GreenChevronRight}
                className ="bg-[#9DEECF] !text-[#00A270]"
            />
        </div>
    );
};

export default CallResultDeniedPage;