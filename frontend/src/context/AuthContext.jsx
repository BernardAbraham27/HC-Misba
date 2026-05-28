import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  adminLoginUser,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: "gg-token",
  user: "gg-user",
  role: "gg-role",
};

function readStoredAuth() {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    const user = localStorage.getItem(STORAGE_KEYS.user);
    const role = localStorage.getItem(STORAGE_KEYS.role);
    if (!token || !user || !role) return null;
    return {
      token,
      user: JSON.parse(user),
      role,
    };
  } catch {
    return null;
  }
}

function persistAuth(auth) {
  localStorage.setItem(STORAGE_KEYS.token, auth.token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(auth.user));
  localStorage.setItem(STORAGE_KEYS.role, auth.role);
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.role);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredAuth()?.token || "");
  const [user, setUser] = useState(() => readStoredAuth()?.user || null);
  const [role, setRole] = useState(() => readStoredAuth()?.role || "");
  const [loading, setLoading] = useState(false);

  const applyAuth = (auth) => {
    persistAuth(auth);
    setToken(auth.token);
    setUser(auth.user);
    setRole(auth.role);
  };

  const clearAuth = () => {
    clearStoredAuth();
    setToken("");
    setUser(null);
    setRole("");
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const auth = await loginUser(credentials);
      applyAuth(auth);
      return auth;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (credentials) => {
    setLoading(true);
    try {
      const auth = await adminLoginUser(credentials);
      applyAuth(auth);
      return auth;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      return await registerUser(payload);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    if (!token) return null;
    setLoading(true);
    try {
      const profile = await getCurrentUser(token);
      const updatedAuth = { token, user: profile, role: profile.role };
      applyAuth(updatedAuth);
      return profile;
    } catch (error) {
      clearAuth();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
  };

  useEffect(() => {
    const stored = readStoredAuth();
    if (!stored?.token) return;
    setToken(stored.token);
    setUser(stored.user);
    setRole(stored.role);
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      clearAuth();
    };

    window.addEventListener("gg-auth-expired", handleAuthExpired);
    return () => window.removeEventListener("gg-auth-expired", handleAuthExpired);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: role === "Admin",
      isCustomer: role === "Customer",
      login,
      adminLogin,
      register,
      logout,
      getProfile,
    }),
    [user, token, role, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
