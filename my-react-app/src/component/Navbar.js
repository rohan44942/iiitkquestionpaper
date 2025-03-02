import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../contextapi/userContext";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SpeakerNotesOutlinedIcon from "@mui/icons-material/SpeakerNotesOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger icon
import CloseIcon from "@mui/icons-material/Close";
function Navbar() {
  const { isAuthenticated, user } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    if (isAuthenticated) {
      setMenuOpen(false);
    }
  }, [isAuthenticated]);

  return (
    <nav
      className={`fixed top-0 left-0 md:h-full lg:h-full lg:rounded-none w-[4.5rem] md:bg-white  text-black flex flex-col items-center py-4 border-slate-200 border-r-2 shadow-lg z-50 ${
        menuOpen
          ? "w-40 h-full bg-white "
          : "w-16 ml-1 mt-1 bg-white rounded-full "
      }`}
    >
      {/* Hamburger Icon for Mobile */}
      <div className="block md:hidden ">
        {menuOpen ? (
          <CloseIcon className="text-3xl text-blue-600 " onClick={toggleMenu} />
        ) : (
          <MenuIcon className="text-2xl text-blue-600" onClick={toggleMenu} />
        )}
      </div>

      {/* Menu Items */}
      <div className={`${menuOpen ? "block" : "hidden"} md:block w-full `}>
        <ul className="flex flex-col items-center mt-16 gap-6">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center w-full py-2 px-[0.6rem] mt-2  hover:bg-blue-100 hover:border-spacing-2 hover:border hover:rounded-sm  transition-colors ${
                  isActive ? "text-blue-600 font-extrabold" : ""
                }`
              }
            >
              <span className="text-2xl">
                <HomeOutlinedIcon className="text-blue-500" />
              </span>
              <span className="text-sm mt-1">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notes"
              className={({ isActive }) =>
                `flex flex-col items-center w-full py-2 sm:px-[0.74rem] px-[0.75rem] mt-2 hover:bg-blue-100 hover:border-spacing-2 hover:border hover:rounded-sm transition-colors ${
                  isActive ? "text-blue-600 font-extrabold" : ""
                }`
              }
            >
              <span className="text-2xl">
                <SpeakerNotesOutlinedIcon className="text-blue-500" />
              </span>
              <span className="text-sm mt-1">Notes</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `flex flex-col items-center w-full py-2 px-[0.52rem] mt-2  hover:bg-blue-100 hover:border-spacing-2 hover:border hover:rounded-sm transition-colors ${
                  isActive ? "text-blue-600 font-extrabold" : ""
                }`
              }
            >
              <span className="text-2xl">
                <DriveFolderUploadOutlinedIcon className="text-blue-500" />
              </span>
              <span className="text-sm mt-1">Upload</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex flex-col items-center w-full py-2 px-[0.7rem] mt-2  hover:bg-blue-100 hover:border-spacing-2 hover:border hover:rounded-sm transition-colors ${
                  isActive ? "text-blue-600 font-extrabold" : ""
                }`
              }
            >
              <span className="text-2xl">
                <InfoOutlinedIcon className="text-blue-500" />
              </span>
              <span className="text-sm mt-1">About</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
