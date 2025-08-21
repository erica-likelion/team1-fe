import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useUser } from "@contexts/UserContext";
import TextButton from "@components/commons/TextButton";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";


const CallResultApprovePage = () => {
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
                {user?.name}님의 예약이 
                <span className="text-[#3DE0AB] pl-1"> 승인</span>
                되었습니다.
            </div>
            <div className="flex flex-col item-left mt-20 ml-5 font-medium ">
                <div className="text-[20px] text-gray-400 leading-relaxed">
                    예약 날짜
                </div>
                <div className="text-[24px] text-black leading-relaxed">2025-08-25</div>
                <div className="mt-8 text-[20px] text-gray-400 leading-relaxed">
                    예약 시간
                </div>
                <div className="text-[24px] text-black leading-relaxed">14:00</div>
            </div>

            <TextButton
                text="예약 내역 확인하기"
                onClick={handleNext}
                icon={WhiteChevronRight}
            />
        </div>
    );
};

export default CallResultApprovePage;