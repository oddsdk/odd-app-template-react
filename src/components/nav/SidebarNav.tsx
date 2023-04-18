import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { getRecoil } from "recoil-nexus";

import { sessionStore } from '../../stores'
import About from '../icons/About'
import BrandLogo from '../icons/BrandLogo'
import Disconnect from '../icons/Disconnect'
import Home from '../icons/Home'
import NavItem from './NavItem'
import PhotoGallery from '../icons/PhotoGallery'
import Settings from '../icons/Settings'

const navItemsUpper = [
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
    label: 'Account Settings',
    href: '/settings/',
    icon: Settings
  }
]

const navItemsLower = [
  {
    label: "About This Template",
    href: "/about/",
    icon: About,
  },
  {
    label: "Disconnect",
    callback: async () => {
      const session = getRecoil(sessionStore)
      await session.session.destroy();
      // Force a hard refresh to ensure everything is disconnected properly
      window.location.href = window.location.origin;
    },
    icon: Disconnect,
    placement: "bottom",
  },
];

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
          className={`drawer-side ${
            location.pathname.match(/register|backup|delegate|recover/) ? "!hidden" : ""
          }`}
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
            </div>

            {/* Upper Menu */}
            <ul>
              {navItemsUpper.map((item, key) => (
                <NavItem
                  handleCloseDrawer={handleCloseDrawer}
                  item={item}
                  key={key}
                />
              ))}
            </ul>

            {/* Lower Menu */}
            <ul className="mt-auto pb-8">
              {navItemsLower.map((item, key) => (
                <NavItem
                  handleCloseDrawer={handleCloseDrawer}
                  item={item}
                  key={key}
                />
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
