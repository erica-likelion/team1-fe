import Logo from "@assets/images/logo.svg";
import LeftArrow from "@assets/images/left_arrow.svg";
import Language from "@assets/images/language.svg";
import Close from "@assets/images/close.svg";
import Alert from "@assets/images/alert.svg";
import Search from "@assets/images/search.svg";
import ChevronLeft from "@assets/images/chevron_left.svg";
/* 
    NavBar
    - type: home, mypage, chat, language, 
            prescription, prescription_upload, prescription_result,
            precheck, call, reservation_time, reservation_result,
            qr, chatroom, treat-info-form, default
    home: 홈페이지
    mypage: 마이페이지
    chat: 통역채팅방 리스트 페이지
    chatroom: 통역채팅방 페이지
    qr: 채팅방 qr 페이지
    language: 언어 선택 페이지
    prescription: 처방전 안내 페이지 
    prescription_upload: 처방전 업로드 페이지
    prescription_result: 처방전 결과 페이지
    precheck: 사전 문진 결과 페이지
    call: 전화번호 입력 페이지
    reservation_time: 전화 예약 페이지
    reservation_result: 예약 결과페이지
    treat-info-form: 사전문진 페이지
    default: 그 외
*/


const NavBar = ({
    type = "default",
    title = "",
    onLeftClick,
    onRightClick,
    disableLeftClick = false
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
            prescription_result: {
                leftIcon: null,
                rightIcon: Close
            },
            precheck: {
                leftIcon: null,
                rightIcon:Close,
            },
            call: {
                leftIcon: LeftArrow,
                rightIcon: Close,
            },
            reservation_result: {
                leftIcon: null,
                rightIcon: Close,
            },
            language: {
                leftIcon: ChevronLeft,
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
                {config.leftIcon && <img 
                    className={`${disableLeftClick ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}`} 
                    src={config.leftIcon} 
                    alt="navbar_left_icon"
                    onClick={disableLeftClick ? undefined : onLeftClick}
                />}
            </div>
            <div className="flex-2 flex justify-center items-center">
                <p className="font-semibold text-xl">{title}</p>
            </div>
            <div className="flex-1 flex justify-end items-center">
                {config.rightIcon && <img 
                    className="w-6 h-6 hover:cursor-pointer"
                    alt="navbar_right_icon"
                    src={config.rightIcon} 
                    onClick={onRightClick}
                />}
            </div>
        </div>
    )
}

export default NavBar;