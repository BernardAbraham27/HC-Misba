import api, { unwrapResponse } from "./api";

function mapRole(role) {
  if (role === 1 || role === "Admin") {
    return "Admin";
  }
  return "Customer";
}

function normalizeAuthResponse(data) {
  return {
    token: data.token,
    user: {
      ...data.user,
      role: mapRole(data.user?.role),
    },
  };
}

export async function login(payload) {
  const response = await api.post("/api/auth/login", payload);
  return normalizeAuthResponse(unwrapResponse(response));
}

export async function register(payload) {
  const response = await api.post("/api/auth/register", payload);
  return normalizeAuthResponse(unwrapResponse(response));
}

export async function adminLogin(payload) {
  const response = await api.post("/api/auth/admin-login", payload);
  return normalizeAuthResponse(unwrapResponse(response));
}

export async function getCurrentUser() {
  const response = await api.get("/api/auth/me");
  const data = unwrapResponse(response);
  return {
    ...data,
    role: mapRole(data.role),
  };
}

export async function logout() {
  const response = await api.post("/api/auth/logout");
  return unwrapResponse(response);
}
