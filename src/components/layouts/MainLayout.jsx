/* TopNavBar와 BottomNavBar가 동시에 있는 페이지에 사용하는 레이아웃 */

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSearch } from "@contexts/SearchContext";

import NavBar from "@components/commons/NavBar";
import BottomNavBar from "@components/commons/BottomNavBar";
import { getNavBarConfig } from "@utils/navConfig";

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { toggleSearchMode } = useSearch();
    
    const navBarConfig = getNavBarConfig(location.pathname, navigate, t, toggleSearchMode);

    return (
        <div className="max-w-[375px] mx-auto">
            <div className="flex flex-col">
                <NavBar 
                    type={navBarConfig.type} 
                    title={navBarConfig.title}
                    onLeftClick={navBarConfig.onLeftClick}
                    onRightClick={navBarConfig.onRightClick}
                />
                
                <main className="flex-1 pt-[62px] pb-[80px]">
                    <Outlet />
                </main>
                
                <BottomNavBar type={navBarConfig.type} />
            </div>
        </div>
    );
};

export default MainLayout;