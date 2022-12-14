import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavItem = ({ handleCloseDrawer, item }) => {
  const location = useLocation();

  return (
    <li>
      {item.callback ? (
        <button
          className={`flex items-center justify-start gap-2 font-bold text-sm text-base-content hover:text-base-100 bg-base-100 hover:bg-base-content ease-in-out duration-[250ms] ${
            location.pathname === item.href
              ? "!text-base-100 !bg-base-content"
              : ""
          }`}
          onClick={() => {
            handleCloseDrawer();
            item.callback();
          }}
        >
          {React.createElement(item.icon)}
          {item.label}
        </button>
      ) : (
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
      )}
    </li>
  );
};

export default NavItem;
