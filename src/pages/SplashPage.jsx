import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Logo from "@assets/images/logo.svg";

const SplashPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setIsVisible(false);
        }, 1500);

        const navigateTimer = setTimeout(() => {
            navigate('/home');
        }, 2000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(navigateTimer);
        };
    }, [navigate]);

    return (
        <div 
            className={`flex flex-col justify-center items-center w-screen h-screen transition-opacity duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <img src={Logo} alt="logo" className="w-[177px] h-[177px]"/>
            <p className="mt-[-18px] text-[28px] font-medium text-[#3DE0AB]">{t('brand')}</p>
        </div>
    )
}

export default SplashPage;