import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { sessionStore, themeStore } from "../stores";
import { DEFAULT_THEME_KEY, storeTheme, ThemeOptions } from "../lib/theme";
import Avatar from "./settings/Avatar";
import BrandLogo from "./icons/BrandLogo";
import DarkMode from "./icons/DarkMode";
import Hamburger from "./icons/Hamburger";
import LightMode from "./icons/LightMode";
import Shield from "./icons/Shield";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useRecoilState(themeStore);
  const session = useRecoilValue(sessionStore);

  const handleUpdateTheme = () => {
    localStorage.setItem(DEFAULT_THEME_KEY, "false");
    const newTheme = Object.values(ThemeOptions).filter((val) => val !== theme.selectedTheme)[0];
    setTheme({
      selectedTheme: newTheme,
      useDefault: false,
    });
    storeTheme(newTheme)
  };

  return (
    <header className="navbar flex bg-base-100 pt-4">
      <div className="lg:hidden">
        {session.session ? (
          <label
            htmlFor="sidebar-nav"
            className="drawer-button cursor-pointer -translate-x-2"
          >
            <Hamburger />
          </label>
        ) : (
          <div
            className="flex items-center cursor-pointer gap-3"
            onClick={() => navigate("/")}
          >
            <BrandLogo />
          </div>
        )}
      </div>

      {/* Even if the user is not authed, render this header in the connection flow */}
      {(!session.session ||
        location.pathname.match(/register|backup|delegate/)) && (
        <div
          className="hidden lg:flex flex-1 items-center cursor-pointer gap-3"
          onClick={() => navigate("/")}
        >
          <BrandLogo />
        </div>
      )}

      <div className="ml-auto">
        {!session.loading && session.session && !session.backupCreated && (
          <span
            onClick={() => navigate("/delegate-account")}
            className="btn btn-sm h-10 btn-warning rounded-full bg-orange-200 border-2 border-neutral-900 font-medium text-neutral-900 transition-colors ease-in hover:bg-orange-300"
          >
            <span className="mr-2">Backup recommended</span>
            <Shield />
          </span>
        )}

        {session.session && (
          <Link to="/settings" className="ml-2 cursor-pointer">
            <Avatar size="small" />
          </Link>
        )}

        <span className="ml-2">
          <span onClick={handleUpdateTheme} className="cursor-pointer">
            {theme.selectedTheme === ThemeOptions.LIGHT ? <LightMode /> : <DarkMode />}
          </span>
        </span>
      </div>
    </header>
  );
};

export default Header;
