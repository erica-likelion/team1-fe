import Logo from "@assets/images/logo.svg";
import LeftArrow from "@assets/images/left_arrow.svg";
import Language from "@assets/images/language.svg";
import Close from "@assets/images/close.svg";
import Alert from "@assets/images/alert.svg";
import Search from "@assets/images/search.svg";

/* 
    TopNavBar
    - type: home, chat, mypage, default
    home: 홈페이지
    chat: 통역채팅 페이지
    mypage: 마이페이지
    default: 그 외
*/


const NavBar = ({
    type = "default",
    title = "",
    onLeftClick,
    onRightClick
}) => {
    const baseClasses = "flex item-center justify-between bg-[#FAFAFA] px-5 h-15.5 fixed top-0 left-1/2 transform -translate-x-1/2 max-w-[375px] w-full z-50"

    // 타입별 아이콘 설정
    const getNavConfig = () => {
        const configs = {
            home: {
                leftIcon: Logo,
                rightIcon: Language,
            },
            mypage: {
                leftIcon: Alert,
                rightIcon: Language,
            },
            chat: {
                leftIcon: Logo,
                rightIcon: Search, 
            },
            chatroom: {
                leftIcon: LeftArrow,
                rightIcon: Search,
            },
            qr: {
                leftIcon: LeftArrow,
                rightIcon: null
            },
            default: {
                leftIcon: LeftArrow,
                rightIcon: Close,
            }
        };
        
        return configs[type] || configs.default;
    };

    const config = getNavConfig();

    return (
        <div className={baseClasses}>
            <div className="flex-1 flex justify-start items-center">
                <img 
                    className="hover:cursor-pointer" 
                    src={config.leftIcon} 
                    onClick={onLeftClick}
                />
            </div>
            <div className="flex-2 flex justify-center items-center">
                <p className="font-semibold text-5">{title}</p>
            </div>
            <div className="flex-1 flex justify-end items-center">
                {config.rightIcon && <img 
                    className="w-6 h-6 hover:cursor-pointer"
                    src={config.rightIcon} 
                    onClick={onRightClick}
                />}
            </div>
        </div>
    )
}

export default NavBar;