/* TopNavBar만 있는 레이아웃 */

import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import NavBar from "@components/commons/NavBar";
import { getNavBarConfig } from "@utils/navConfig";
import { useSearch } from "@contexts/SearchContext";

const SimpleLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { toggleSearchMode } = useSearch();
    const [searchParams] = useSearchParams();

    const navBarConfig = getNavBarConfig(location.pathname, navigate, t, toggleSearchMode);
    
    // userType이 'medi'이고 chatroom 타입일 때 뒤로가기 비활성화
    const userType = searchParams.get('userType');
    const disableLeftClick = navBarConfig.type === 'chatroom' && userType === 'medi';

    return (
        <div className="max-w-[375px] mx-auto">
            <div className="flex flex-col mb-7">
                <NavBar 
                    type={navBarConfig.type} 
                    title={navBarConfig.title}
                    onLeftClick={navBarConfig.onLeftClick}
                    onRightClick={navBarConfig.onRightClick}
                    disableLeftClick={disableLeftClick}
                />
                
                <main className="flex-1 pt-[62px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SimpleLayout;