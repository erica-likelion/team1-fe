import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useUser } from "@contexts/UserContext";
import TextButton from "@components/commons/TextButton";
import GreenChevronRight from "@assets/images/green_chevron_right.svg";


const CallResultDeniedPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useUser();

    const handleNext = () => {
            navigate('/home');
    };


    return (
        <div className="mt-9.5 px-5">
            {user &&
            <div className="flex items-center justify-center text-[20px] font-semibold ">
                {t('call.result.messageParts.part1')}
                {user ? user.name : t('user.defaultName')}
                {t('call.result.messageParts.part2')}
                <span className="text-[#3DE0AB] pl-1">
                    {t('call.result.denied')}
                </span>
                {t('call.result.messageParts.part3')}
            </div>}
        

            <TextButton
                text={t('call.buttons.home')}
                onClick={handleNext}
                icon={GreenChevronRight}
                className ="bg-[#9DEECF] !text-[#00A270]"
            />
        </div>
    );
};

export default CallResultDeniedPage;