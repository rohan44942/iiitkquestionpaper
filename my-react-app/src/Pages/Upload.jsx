import { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Uploaddoc from "../component/Uploaddoc";
import Uploadnotes from "../component/Uploadnotes";
import { UserContext } from "../contextapi/userContext";
import { useContext } from "react";

const Upload = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const { isAuthenticated } = useContext(UserContext);

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="pt-20 flex flex-col items-center justify-center min-h-screen  bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600 p-6 ">
      {isAuthenticated ? (
        <div className="flex items-center flex-col  h-1/3 p-10 rounded-md bg-white border-2 shadow-md shadow-gray-400 lg:w-1/2">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Select What You Want to Upload
          </h1>

          <select
            name="typeofpdf"
            id="typeofpdf"
            onChange={handleSelectChange}
            className="border items-center border-gray-300 w-2/3 rounded p-2 mb-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Choose type</option>
            <option value="papers">Exam Papers</option>
            <option value="notes">Study Material (Notes)</option>
          </select>

          <div className="w-full max-w-md">
            {selectedOption === "notes" && <Uploadnotes />}
            {selectedOption === "papers" && <Uploaddoc />}
          </div>
        </div>
      ) : (
        <div className="flex items-center flex-col  h-1/2 p-10 rounded-md bg-white border-2 shadow-md shadow-gray-400 lg:w-1/2 ">
          <p className="text-center font-bold text-[1.5rem] ">
            Please login first to uplaod
          </p>
          <div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
