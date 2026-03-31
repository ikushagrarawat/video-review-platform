import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (_error) {
      localStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      localStorage.removeItem("token");
      setToken(null);
      setAuthToken(null);
    }
  }, [token, user]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const payload = response.data;
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
    setAuthToken(payload.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
