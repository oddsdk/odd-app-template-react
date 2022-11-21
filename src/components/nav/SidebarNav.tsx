import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { sessionStore } from '../../stores'
import About from '../icons/About'
import AlphaTag from './AlphaTag'
import BrandLogo from '../icons/BrandLogo'
import BrandWordmark from '../icons/BrandWordmark'
import Home from '../icons/Home'
import PhotoGallery from '../icons/PhotoGallery'
import Settings from '../icons/Settings'

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: Home
  },
  {
    label: 'Photo Gallery Demo',
    href: '/gallery/',
    icon: PhotoGallery
  },
  {
    label: 'About This Template',
    href: '/about/',
    icon: About
  },
  {
    label: 'Account Settings',
    href: '/settings/',
    icon: Settings
  }
]

const SidebarNav = ({ children }: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useRecoilValue(sessionStore);
  const [checked, setChecked] = useState(false)

  const handleCloseDrawer = (): void => {
    setChecked(false)
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  // Only render the nav if the user is authed and not in the connection flow
  if (session.session) {
    return (
      <div className="drawer drawer-mobile h-screen">
        <input
          id="sidebar-nav"
          className="drawer-toggle"
          type="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        <div className="drawer-content flex flex-col">{children}</div>
        <div
          className={`drawer-side ${location.pathname.match(
            /register|backup|delegate/
          ) ? '!hidden' : ''}`}
        >
          <label
            htmlFor="sidebar-nav"
            className="drawer-overlay !bg-[#262626] !opacity-[.85]"
          />
          <div className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
            {/* Brand */}
            <div
              className="flex items-center gap-3 cursor-pointer mb-8"
              onClick={() => {
                handleCloseDrawer();
                navigate("/");
              }}
            >
              <BrandLogo />
              <BrandWordmark />
              <AlphaTag />
            </div>

            {/* Menu */}
            <ul>
              {navItems.map((item, key) => (
                <li key={key}>
                  <Link
                    className={`flex items-center justify-start gap-2 font-bold text-sm text-base-content hover:text-base-100 bg-base-100 hover:bg-base-content ease-in-out duration-[250ms] ${
                      location.pathname === item.href
                        ? "!text-base-100 !bg-base-content"
                        : ""
                    }`}
                    to={item.href}
                    onClick={handleCloseDrawer}
                  >
                    {React.createElement(item.icon)}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default SidebarNav;
