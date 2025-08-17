/* TopNavBar만 있는 레이아웃 */

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TopNavBar from "@components/commons/TopNavBar";
import { getNavBarConfig } from "@utils/navConfig";
import { useSearch } from "@contexts/SearchContext";

const SimpleLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { toggleSearchMode } = useSearch();

    const navBarConfig = getNavBarConfig(location.pathname, navigate, t, toggleSearchMode);

    return (
        <div className="max-w-[375px] mx-auto">
            <div className="flex flex-col mb-7">
                <TopNavBar 
                    type={navBarConfig.type} 
                    title={navBarConfig.title}
                    onLeftClick={navBarConfig.onLeftClick}
                    onRightClick={navBarConfig.onRightClick}
                />
                
                <main className="flex-1 pt-[62px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SimpleLayout;