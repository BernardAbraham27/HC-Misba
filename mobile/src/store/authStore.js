import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authService from "../services/authService";
import { GUEST_KEY, ROLE_KEY, TOKEN_KEY, USER_KEY } from "../services/api";

const AuthContext = createContext(null);

async function persistAuthSession({ token, user, role }) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
    [ROLE_KEY, role],
  ]);
  await AsyncStorage.removeItem(GUEST_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  async function clearAuth() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, ROLE_KEY, GUEST_KEY]);
    setUser(null);
    setToken(null);
    setRole(null);
    setIsGuest(false);
    setError(null);
  }

  async function loadCurrentUser() {
    setIsLoading(true);
    setError(null);

    try {
      const storedEntries = await AsyncStorage.multiGet([
        TOKEN_KEY,
        USER_KEY,
        ROLE_KEY,
        GUEST_KEY,
      ]);

      const map = Object.fromEntries(storedEntries);
      const storedToken = map[TOKEN_KEY];
      const storedUser = map[USER_KEY];
      const storedRole = map[ROLE_KEY];

      if (!storedToken) {
        setUser(null);
        setToken(null);
        setRole(null);
        setIsGuest(map[GUEST_KEY] === "true");
        return;
      }

      setToken(storedToken);
      setRole(storedRole || null);
      setUser(storedUser ? JSON.parse(storedUser) : null);

      const currentUser = await authService.getCurrentUser();
      const normalizedRole = currentUser?.role || storedRole || "Customer";

      if (normalizedRole !== "Customer" && normalizedRole !== "Admin") {
        throw new Error("Unsupported account role.");
      }

      await persistAuthSession({
        token: storedToken,
        user: currentUser,
        role: normalizedRole,
      });

      setUser(currentUser);
      setRole(normalizedRole);
      setIsGuest(false);
    } catch (loadError) {
      await clearAuth();
      setError(loadError.message || "Unable to restore your session.");
    } finally {
      setIsLoading(false);
    }
  }

  async function login(emailOrMobile, password) {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login({ emailOrMobile, password });
      await persistAuthSession({
        token: data.token,
        user: data.user,
        role: data.user?.role || "Customer",
      });
      setToken(data.token);
      setUser(data.user);
      setRole(data.user?.role || "Customer");
      setIsGuest(false);
      return data;
    } catch (loginError) {
      const message =
        loginError.response?.data?.message ||
        loginError.message ||
        "Unable to sign in.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      await persistAuthSession({
        token: response.token,
        user: response.user,
        role: response.user?.role || "Customer",
      });
      setToken(response.token);
      setUser(response.user);
      setRole(response.user?.role || "Customer");
      setIsGuest(false);
      return response;
    } catch (registerError) {
      const message =
        registerError.response?.data?.message ||
        registerError.message ||
        "Unable to create your account.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function adminLogin(email, password) {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.adminLogin({ email, password });
      await persistAuthSession({
        token: data.token,
        user: data.user,
        role: "Admin",
      });
      setToken(data.token);
      setUser(data.user);
      setRole("Admin");
      setIsGuest(false);
      return data;
    } catch (loginError) {
      const message =
        loginError.response?.data?.message ||
        loginError.message ||
        "Unable to sign in as admin.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      if (token) {
        await authService.logout();
      }
    } catch {
      // Best-effort logout; local session is still cleared below.
    } finally {
      await clearAuth();
    }
  }

  async function continueAsGuest() {
    await clearAuth();
    await AsyncStorage.setItem(GUEST_KEY, "true");
    setIsGuest(true);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isGuest,
      isAuthenticated: Boolean(token && user),
      isAdmin: role === "Admin",
      isCustomer: role === "Customer",
      isLoading,
      error,
      loadCurrentUser,
      login,
      register,
      adminLogin,
      logout,
      clearAuth,
      continueAsGuest,
    }),
    [error, isGuest, isLoading, role, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
