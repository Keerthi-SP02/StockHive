import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { attachToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("sbstocks_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("sbstocks_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    attachToken(token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    api
      .get("/auth/profile")
      .then(({ data }) => {
        if (!active) return;
        setUser(data.user);
        localStorage.setItem("sbstocks_user", JSON.stringify(data.user));
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("sbstocks_token", data.token);
    localStorage.setItem("sbstocks_user", JSON.stringify(data.user));
    return data.user;
  }

  async function register(payload) {
    const { data } = await api.post("/auth/register", payload);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("sbstocks_token", data.token);
    localStorage.setItem("sbstocks_user", JSON.stringify(data.user));
    return data.user;
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("sbstocks_token");
    localStorage.removeItem("sbstocks_user");
    attachToken("");
  }

  async function refreshUser() {
    const { data } = await api.get("/auth/profile");
    setUser(data.user);
    localStorage.setItem("sbstocks_user", JSON.stringify(data.user));
    return data.user;
  }

  async function updateProfile(payload) {
    const { data } = await api.patch("/auth/profile", payload);
    setUser(data.user);
    localStorage.setItem("sbstocks_user", JSON.stringify(data.user));
    return data.user;
  }

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, refreshUser, updateProfile }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
