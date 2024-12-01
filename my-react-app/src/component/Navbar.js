import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../contextapi/userContext";

function Navbar() {
  // const { isAuthenticated, user } = useAuth0();
  // own authentication
  const { isAuthenticated, user } = useContext(UserContext);
  // console.log(isAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  useEffect(() => {
    // This will ensure the navbar is re-rendered when the user logs in or out
    if (isAuthenticated) {
      // console.log("authentication ", isAuthenticated);
      setMenuOpen(false); // Close menu on login
    }
  }, [isAuthenticated]);
  
  return (
    <nav className="fixed top-0 left-0 w-screen flex justify-between items-center py-4 px-6 bg-gray-100 shadow-lg z-50">
      <NavLink exact to="/">
        <div className="text-xl font-bold text-gray-700">Log.oO</div>
      </NavLink>

      <button className="text-gray-600 text-2xl md:hidden" onClick={toggleMenu}>
        ☰
      </button>

      <ul
        className={`md:flex md:items-center gap-8 absolute md:static top-16 right-0 bg-gray-100 md:bg-transparent transition-transform duration-300 ease-in-out ${
          menuOpen
            ? "flex flex-col justify-center  items-center right-0 w-screen  pb-5 md:pb-0"
            : "hidden"
        } md:flex-row md:w-auto `}
      >
        <li>
          <NavLink
            exact
            to="/"
            activeClassName="active-link"
            className="block text-gray-600 text-lg font-medium hover:text-red-500"
            onClick={toggleMenu}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            activeClassName="active-link"
            className="block text-gray-600 text-lg font-medium hover:text-red-500"
            onClick={toggleMenu}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/notes"
            activeClassName="active-link"
            className="block text-gray-600 text-lg font-medium hover:text-red-500"
            onClick={toggleMenu}
          >
            Notes
          </NavLink>
        </li>
        <li>
          {isAuthenticated ? (
            user.email === "2021kucp1109@iiitkota.ac.in" ||
            user.email === "2021kuec2066@iiitkota.ac.in" ||
            user.role === "admin" ? (
              <NavLink
                to="/admin"
                activeClassName="active-link"
                className="block text-gray-600 text-lg font-medium hover:text-red-500"
                onClick={toggleMenu}
              >
                Admin
              </NavLink>
            ) : (
              <NavLink
                to="/user"
                activeClassName="active-link"
                className="block text-gray-600 text-lg font-medium hover:text-red-500"
                onClick={toggleMenu}
              >
                User
              </NavLink>
            )
          ) : (
            <NavLink
              to="/login"
              activeClassName="active-link"
              className="block text-gray-600 text-lg font-medium hover:text-red-500"
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
              className="block text-gray-600 text-lg font-medium hover:text-red-500"
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
              className="block text-gray-600 text-lg font-medium hover:text-red-500 "
              onClick={toggleMenu}
            >
              Upload
            </NavLink>
          </li>
        )}
        {isAuthenticated}
      </ul>
    </nav>
  );
}

export default Navbar;
