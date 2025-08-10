/* TopNavBar와 BottomNavBar가 동시에 있는 페이지에 사용하는 레이아웃 */

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TopNavBar from "./TopNavBar";
import BottomNavBar from "./BottomNavBar";

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    // 현재 페이지 위치에 맞는 NavBar 타입 가져오기
    const getNavBarType = () => {
        if (location.pathname === '/home' || location.pathname === '/') return 'home';
        if (location.pathname === '/mypage') return 'mypage';
        if (location.pathname === '/chat') return 'chat';
        return 'default';
    };

    // NavBar 클릭 이벤트 
    const getNavBarHandlers = () => {
        const currentType = getNavBarType();
        
        switch (currentType) {
            case 'home':
                return {
                    onLeftClick: () => navigate('/home'), 
                    onRightClick: () => {
                        // 추후 수정
                        console.log('언어 설정 클릭');
                    }
                };
            case 'mypage':
                return {
                    onLeftClick: () => {
                        // 추후 수정
                        console.log('알림 클릭');
                    },
                    onRightClick: () => {
                        // 추후 수정
                        console.log('언어 설정 클릭');
                    }
                };
            case 'chat':
                return {
                    onLeftClick: () => {
                        // 추후 수정
                        console.log('검색 클릭');
                    },
                    onRightClick: () => {
                        // 추후 수정
                        console.log('언어 설정 클릭');
                    }
                };
            default:
                return {
                    onLeftClick: () => navigate(-1), 
                    onRightClick: () => navigate('/home')
                };
        }
    };

    // NavBar 타입에 맞는 title 가져오기 (TopNavBar 중앙 텍스트)
    const getNavBarTitle = () => {
        const currentType = getNavBarType();
        
        switch (currentType) {
            case 'mypage':
                return t('navigation.mypage');
            case 'chat':
                return t('navigation.chat');
            default:
                return "";
        }
    }

    const navBarType = getNavBarType();
    const navBarHandlers = getNavBarHandlers();
    const navBarTitle = getNavBarTitle();

    return (
        <div className="max-w-[375px] mx-auto">
            <div className="flex flex-col">
                <TopNavBar 
                    type={navBarType} 
                    title={navBarTitle}
                    onLeftClick={navBarHandlers.onLeftClick}
                    onRightClick={navBarHandlers.onRightClick}
                />
                
                <main className="flex-1 pt-[62px] pb-[80px]">
                    <Outlet />
                </main>
                
                <BottomNavBar type={navBarType} />
            </div>
        </div>
    );
};

export default MainLayout;