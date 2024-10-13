import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
  const { isAuthenticated } = useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-gray-100 shadow-lg">
      <div className="text-xl font-bold text-gray-700 flex items-center">
        <img
          src="/logo.png" // Make sure the path is correct
          alt="Logo"
          className="h-16 w-auto" // Adjust height and keep aspect ratio
        />
      </div>

      {/* Toggle Button for Mobile */}
      <button
        className="text-gray-600 text-2xl md:hidden"
        onClick={toggleMenu}
      >
        ☰
      </button>

      {/* Menu Items */}
      <ul
        className={`flex-col md:flex-row md:flex md:items-center gap-8 pr-14 absolute md:static left-0 right-0 bg-gray-100 md:bg-transparent w-full md:w-auto transition-transform duration-300 ease-in-out ${
          menuOpen ? "top-16 flex justify-center items-center" : "-top-full"
        } md:top-auto`}
      >
        <li>
          <NavLink
            exact
            to="/"
            activeClassName="active-link"
            className="text-gray-600 text-lg font-medium hover:text-red-500 "
            onClick={toggleMenu}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            activeClassName="active-link"
            className="text-gray-600 text-lg font-medium hover:text-red-500 "
            onClick={toggleMenu}
          >
            About
          </NavLink>
        </li>
        <li>
          {isAuthenticated ? (
            <NavLink
              to="/user"
              activeClassName="active-link"
              className="text-gray-600 text-lg font-medium hover:text-red-500 "
              onClick={toggleMenu}
            >
              User
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              activeClassName="active-link"
              className="text-gray-600 text-lg font-medium hover:text-red-500 "
              onClick={toggleMenu}
            >
              Login
            </NavLink>
          )}
        </li>
        {isAuthenticated ? (
          <li>
            <NavLink
              to="/upload"
              activeClassName="active-link"
              className="text-gray-600 text-lg font-medium hover:text-red-500 "
              onClick={toggleMenu}
            >
              Upload
            </NavLink>
          </li>
        ) : (
          <li>
            <NavLink
              to="/login"
              activeClassName="active-link"
              className="text-gray-600 text-lg font-medium hover:text-red-500 "
              onClick={toggleMenu}
            >
              Upload
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
