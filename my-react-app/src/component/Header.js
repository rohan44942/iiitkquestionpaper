import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contextapi/userContext";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const Header = () => {
  const { isAuthenticated, user } = useContext(UserContext);
  return (
    <div className="text-black bg-transparent text-center flex flex-row justify-end pr-5 h-[4.2rem] border-slate-700 border-r-2">
      <div>
        {isAuthenticated ? (
          user.email === "2021kucp1109@iiitkota.ac.in" ||
          user.email === "2021kuec2066@iiitkota.ac.in" ||
          user.role === "admin" ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex flex-col items-center  w-full mt-1 px-3 hover:bg-blue-100 hover:border-spacing-2 hover:border hover:rounded-sm transition-colors ${
                  isActive ? "text-blue-600 font-extrabold" : ""
                }`
              }
            >
              <span className="text-2xl">
                <AdminPanelSettingsOutlinedIcon className="text-blue-500" />
              </span>
              <span className="text-sm mt-1">Admin</span>
            </NavLink>
          ) : (
            <NavLink
              to="/user"
              className={({ isActive }) =>
                `flex flex-col items-center w-full  mt-1 px-3 hover:bg-blue-100 hover:border-spacing-2 hover:border hover:rounded-sm transition-colors  ${
                  isActive ? "text-blue-600 font-extrabold" : ""
                }`
              }
            >
              <span className="text-2xl">
                <AccountCircleOutlinedIcon className="text-blue-500" />
              </span>
              <span className="text-sm mt-1">User</span>
            </NavLink>
          )
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex flex-col items-center  w-full py-2 px-3 mt-2 hover:bg-blue-100 hover:border-spacing-2 hover:border hover:rounded-sm transition-colors ${
                isActive ? "text-blue-600 font-extrabold" : ""
              }`
            }
          >
            <span className="">
              <LogoutOutlinedIcon className="text-blue-500 " />
              <span className="ml-2 pt-1">Login</span>
            </span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Header;
