import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";

import { sessionStore, themeStore } from '../stores';
import { THEME } from '../lib/theme';
import { appName } from '../lib/app-info';
import Brand from './icons/Brand';
import DarkMode from './icons/DarkMode';
import LightMode from './icons/LightMode';
import Shield from './icons/Shield';

const Header = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useRecoilState(themeStore);
  const session = useRecoilValue(sessionStore);

  const handleUpdateTheme = () => {
    const newTheme = Object.values(THEME).filter((val) => val !== theme)[0];
    setTheme(newTheme);
  }

  return (
    <header className="navbar bg-base-100 pt-0">
      <div className="flex-1 cursor-pointer hover:underline" onClick={() => {}}>
        <Brand />
        <span className="text-xl ml-2 hidden md:inline">{appName}</span>
      </div>

      {!session.loading && !session.authed && (
        <div className="flex-none">
          <a className="btn btn-sm h-10 btn-primary normal-case" href="/connect">
            Connect
          </a>
        </div>
      )}

      {!session.loading && session.authed && !session.backupCreated && (
        <span
          onClick={() => navigate('delegate-account')}
          className="btn btn-sm h-10 btn-warning rounded-full font-normal transition-colors ease-in hover:bg-orange-500 hover:border-orange-500"
        >
          <Shield />
          <span className="ml-2 hidden md:block">Backup recommended</span>
        </span>
      )}

      <span className="ml-2">
          <span onClick={handleUpdateTheme}>
            {theme === THEME.LIGHT ? (
              <LightMode />
            ):(
              <DarkMode />
            )}
          </span>
      </span>
    </header>
  );
};

export default Header;
