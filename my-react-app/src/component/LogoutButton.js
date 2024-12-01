import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import the useNavigate hook
import { UserContext } from "../contextapi/userContext";

const LogoutButton = () => {
  const { logout } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = async () => {
    setLoading(true); // Set loading to true
    try {
      await logout(); // Call the logout function from context
      navigate("/"); // Redirect to home page after successful logout
    } catch (err) {
      console.error("Logout failed:", err);
      // Optionally handle errors (e.g., show an error message)
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
      disabled={loading} // Disable button while loading
    >
      {loading ? "Logging out..." : "Log Out"} {/* Show loading state text */}
    </button>
  );
};

export default LogoutButton;
