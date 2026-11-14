import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication state from localStorage on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("gramshiksha_token");
        const storedUser = localStorage.getItem("gramshiksha_user");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);

          // Verify token validity against backend profile API
          try {
            const profileRes = await authService.getProfile();
            if (profileRes?.user) {
              setUser(profileRes.user);
              localStorage.setItem(
                "gramshiksha_user",
                JSON.stringify(profileRes.user)
              );
            }
          } catch (err) {
            // If token has expired or is invalid, clean up session
            if (err?.response?.status === 401) {
              console.warn("Session expired on initialization:", err.message);
              localStorage.removeItem("gramshiksha_token");
              localStorage.removeItem("gramshiksha_user");
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (e) {
        console.error("Error reading auth storage:", e);
        localStorage.removeItem("gramshiksha_token");
        localStorage.removeItem("gramshiksha_user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for unauthorized events emitted by Axios interceptor
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  // Login handler
  const login = useCallback(async ({ email, password }) => {
    const res = await authService.login({ email, password });
    if (res?.token && res?.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("gramshiksha_token", res.token);
      localStorage.setItem("gramshiksha_user", JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res?.message || "Login failed");
  }, []);

  // Registration handler
  const register = useCallback(async ({ name, email, password }) => {
    const res = await authService.register({ name, email, password });
    return res;
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem("gramshiksha_token");
    localStorage.removeItem("gramshiksha_user");
    setToken(null);
    setUser(null);
  }, []);

  // Profile update handler
  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedUserData };
      localStorage.setItem("gramshiksha_user", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "ADMIN",
    isStudent: user?.role === "STUDENT",
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
