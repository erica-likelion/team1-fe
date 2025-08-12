import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Chat from "@assets/images/chat.svg";
import Home from "@assets/images/home.svg";
import Mypage from "@assets/images/mypage.svg";
import ActiveChat from "@assets/images/active_chat.svg";
import ActiveHome from "@assets/images/active_home.svg";
import ActiveMypage from "@assets/images/active_mypage.svg";

const BottomNavBar = ({
    type="home"
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const onChatClick = () => navigate("/chat");
    const onHomeClick = () => navigate("/home");
    const onMypageClick = () => navigate("/mypage");

    const tabs = [
        { id: 'chat', icon: Chat, activeIcon: ActiveChat, label: t('navigation.chat'), clickEvent: onChatClick},
        { id: 'home', icon: Home, activeIcon: ActiveHome, label: t('navigation.home'), clickEvent: onHomeClick},
        { id: 'mypage', icon: Mypage, activeIcon: ActiveMypage, label: t('navigation.mypage'), clickEvent: onMypageClick}
    ]

    return (
        <div>
            <div className="flex item-center justify-between bg-[#FAFAFA] border-t border-[#E9E9EA] px-10 pt-2 pb-8 fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-[375px] w-full z-50">
                {tabs.map((tab) => (
                    <div key={tab.id} className="flex-1 flex flex-col justify-center items-center gap-2">
                        <img className="hover:cursor-pointer" src={type === tab.id ? tab.activeIcon : tab.icon} onClick={tab.clickEvent} />
                        <p className="font-medium text-[12px]" >{tab.label}</p>
                    </div>
                ))}
                
            </div>
        </div>
    )
}

export default BottomNavBar;