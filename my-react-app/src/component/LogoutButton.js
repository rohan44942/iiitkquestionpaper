import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";  
import { UserContext } from "../contextapi/userContext";

const LogoutButton = () => {
  const { logout } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    setLoading(true); 
    try {
      await logout(); 
      navigate("/"); 
    } catch (err) {
      console.error("Logout failed:", err);
      // Optionally handle errors (e.g., show an error message)
    } finally {
      setLoading(false); 
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
      disabled={loading} 
    >
      {loading ? "Logging out..." : "Log Out"} 
    </button>
  );
};

export default LogoutButton;
