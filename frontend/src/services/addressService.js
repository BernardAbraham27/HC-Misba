import { apiRequest } from "./api";

export function getAddresses() {
  return apiRequest("/api/addresses");
}

export function createAddress(payload) {
  return apiRequest("/api/addresses", {
    method: "POST",
    body: payload,
  });
}

export function updateAddress(id, payload) {
  return apiRequest(`/api/addresses/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteAddress(id) {
  return apiRequest(`/api/addresses/${id}`, {
    method: "DELETE",
  });
}

export function setDefaultAddress(id) {
  return apiRequest(`/api/addresses/${id}/default`, {
    method: "PUT",
  });
}
