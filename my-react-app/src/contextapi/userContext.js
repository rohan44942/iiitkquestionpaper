import React, { createContext, useState, useEffect, useRef } from "react";

// Create context
export const UserContext = createContext();

// Context provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [setLoginClicked] = useState(false);
  const apiurl = process.env.REACT_APP_API_URL;

  // Function to update user state and authentication status
  const updateUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(!!userData); // True if userData exists
  };

  const apiurlRef = useRef(apiurl);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${apiurlRef.current}/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to authenticate");

        const data = await response.json();
        if (data.user) {
          updateUser(data.user);
        }
      } catch (err) {
        console.log(err);
        updateUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await fetch(`${apiurl}/user/logout`, {
        method: "GET",
        credentials: "include",
      });

      updateUser(null); // Clear user and authentication state
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        logout,
        updateUser,
        isLoading,
        setLoginClicked,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
