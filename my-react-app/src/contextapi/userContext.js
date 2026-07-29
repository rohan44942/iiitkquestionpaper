import React, { createContext, useState, useEffect, useRef, useCallback } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const apiurl = process.env.REACT_APP_API_URL;
  const apiurlRef = useRef(apiurl);

  const updateUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(!!userData);
  };

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
        updateUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${apiurl}/user/logout`, {
        method: "GET",
        credentials: "include",
      });
      updateUser(null);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const isFavorite = useCallback(
    (resourceId, resourceType) => {
      if (!user?.favorites) return false;
      return user.favorites.some(
        (f) => f.resourceId === resourceId && f.resourceType === resourceType
      );
    },
    [user]
  );

  const toggleFavorite = async ({ resourceId, resourceType, title, meta }) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return null;
    }
    try {
      const response = await fetch(`${apiurl}/user/favorites`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, resourceType, title, meta }),
      });
      if (!response.ok) throw new Error("Failed to update favorite");
      const data = await response.json();
      setUser((prev) => (prev ? { ...prev, favorites: data.favorites } : prev));
      return data;
    } catch (err) {
      console.error(err);
      return null;
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
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
