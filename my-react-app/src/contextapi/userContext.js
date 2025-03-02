import React, { createContext, useState, useEffect } from "react";

// Create context
export const UserContext = createContext();

// Context provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginClicked, setLoginClicked] = useState(false);
  const apiurl = process.env.REACT_APP_API_URL;

  // Function to update user state and authentication status
  const updateUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(!!userData); // True if userData exists
  };

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${apiurl}/user/me`, {
          method: "GET",
          credentials: "include",
        });
        // console.log(response);

        if (!response.ok) throw new Error("Failed to authenticate");

        const data = await response.json();
        if (data.user) {
          // console.log(data.user);

          updateUser(data.user);
        }
      } catch (err) {
        console.log(err);
        updateUser(null); // Clear user on error
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [loginClicked, apiurl]);

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
