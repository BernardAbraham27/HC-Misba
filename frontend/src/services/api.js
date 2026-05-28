const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5187").replace(/\/$/, "");
const TOKEN_KEY = "gg-token";

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest(path, { method = "GET", body, token, headers } = {}) {
  const authToken = token || localStorage.getItem(TOKEN_KEY);
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new ApiError(
      `Cannot connect to the backend API at ${API_BASE_URL}. Please start the ASP.NET backend server.`,
      0,
      error,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("gg-token");
      localStorage.removeItem("gg-user");
      localStorage.removeItem("gg-role");
      window.dispatchEvent(new CustomEvent("gg-auth-expired"));
    }
    throw new ApiError(
      payload?.message || payload?.title || "Request failed.",
      response.status,
      payload?.errors || null,
    );
  }

  return payload?.data ?? payload;
}

export { API_BASE_URL };
