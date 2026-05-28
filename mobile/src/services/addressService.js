import api, { unwrapResponse } from "./api";

export async function getAddresses() {
  const response = await api.get("/api/addresses");
  const data = unwrapResponse(response);
  return Array.isArray(data) ? data : [];
}
