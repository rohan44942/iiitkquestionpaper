import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../contextapi/userContext";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SpeakerNotesOutlinedIcon from "@mui/icons-material/SpeakerNotesOutlined";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const links = [
  { to: "/", label: "Papers", Icon: HomeOutlinedIcon },
  { to: "/notes", label: "Notes", Icon: SpeakerNotesOutlinedIcon },
  { to: "/upload", label: "Upload", Icon: DriveFolderUploadOutlinedIcon },
  { to: "/community", label: "Community", Icon: ForumOutlinedIcon },
  { to: "/about", label: "About", Icon: InfoOutlinedIcon },
];

function Navbar() {
  const { isAuthenticated } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) setMenuOpen(false);
  }, [isAuthenticated]);

  return (
    <>
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((v) => !v)}
        className="md:hidden fixed top-3 left-3 z-[60] h-10 w-10 rounded-xl bg-white border border-paper-line shadow-soft flex items-center justify-center text-accent"
      >
        {menuOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
      </button>

      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px]"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <nav
        className={`fixed top-0 left-0 z-50 h-full w-[4.75rem] bg-white/95 backdrop-blur border-r border-paper-line shadow-soft
          flex flex-col items-center py-5 transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="hidden md:flex flex-col items-center mb-8">
          <span className="font-display text-lg text-ink leading-none">IIITK</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-accent mt-1">
            Hub
          </span>
        </div>

        <ul className="flex flex-col items-center gap-2 w-full px-2 mt-12 md:mt-0">
          {links.map(({ to, label, Icon }) => (
            <li key={to} className="w-full">
              <NavLink
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 w-full py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-accent-soft text-accent"
                      : "text-ink-muted hover:bg-paper hover:text-ink"
                  }`
                }
              >
                <Icon fontSize="small" />
                <span className="text-[11px] font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
