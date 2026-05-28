import { apiRequest } from "./api";

function mapRole(role) {
  if (role === 1 || role === "Admin") return "Admin";
  return "Customer";
}

function normalizeAuthResponse(data) {
  return {
    token: data.token,
    user: {
      ...data.user,
      role: mapRole(data.user?.role),
    },
    role: mapRole(data.user?.role),
  };
}

export async function loginUser(credentials) {
  const data = await apiRequest("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
  return normalizeAuthResponse(data);
}

export async function adminLoginUser(credentials) {
  const data = await apiRequest("/api/auth/admin-login", {
    method: "POST",
    body: credentials,
  });
  return normalizeAuthResponse(data);
}

export async function registerUser(payload) {
  const data = await apiRequest("/api/auth/register", {
    method: "POST",
    body: payload,
  });
  return normalizeAuthResponse(data);
}

export async function getCurrentUser(token) {
  const data = await apiRequest("/api/auth/me", { token });
  return {
    ...data,
    role: mapRole(data.role),
  };
}
