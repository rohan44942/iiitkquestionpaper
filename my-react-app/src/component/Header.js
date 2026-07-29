import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../contextapi/userContext";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const Header = () => {
  const { isAuthenticated, user } = useContext(UserContext);
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-30 md:pl-[4.75rem] bg-paper/80 backdrop-blur-md border-b border-paper-line">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">
        <div className="pl-10 md:pl-0">
          <p className="font-display text-base sm:text-lg text-ink leading-tight">
            IIITK Resources
          </p>
          <p className="text-[11px] text-ink-muted hidden sm:block">
            Papers · Notes · Peer help
          </p>
        </div>

        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-accent-soft text-accent"
                        : "text-ink-muted hover:bg-white hover:text-ink"
                    }`
                  }
                >
                  <AdminPanelSettingsOutlinedIcon fontSize="small" />
                  <span className="hidden sm:inline">Admin</span>
                </NavLink>
              )}
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent-soft text-accent"
                      : "text-ink-muted hover:bg-white hover:text-ink"
                  }`
                }
              >
                <AccountCircleOutlinedIcon fontSize="small" />
                <span className="hidden sm:inline max-w-[8rem] truncate">
                  {user?.fullName?.split(" ")[0] || "Profile"}
                </span>
              </NavLink>
            </>
          ) : (
            <NavLink to="/login" className="btn-primary !py-2">
              <LoginOutlinedIcon fontSize="small" />
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
