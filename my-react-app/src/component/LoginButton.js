import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false); // Re-enable the button once the login process is done
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out ${
        loading
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      }`}
    >
      {loading ? "Logging in..." : "Log In"}
    </button>
  );
};

export default LoginButton;
