import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center py-8 px-6 bg-gray-100 shadow-lg">
      <div className="text-xl font-bold text-gray-700">Logo</div>
      <ul className="flex gap-8 pr-14">
        <li>
          <NavLink exact to="/" activeClassName="active-link" className="text-gray-600 text-lg font-medium hover:text-red-500 ">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" activeClassName="active-link" className="text-gray-600 text-lg font-medium hover:text-red-500 ">
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" activeClassName="active-link" className="text-gray-600 text-lg font-medium hover:text-red-500 ">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/upload" activeClassName="active-link" className="text-gray-600 text-lg font-medium hover:text-red-500 ">
            Upload
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
