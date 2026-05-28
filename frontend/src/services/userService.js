import { apiRequest } from "./api";

export function getUserById(id) {
  return apiRequest(`/api/users/${id}`);
}

export function updateUserProfile(id, payload) {
  return apiRequest(`/api/users/${id}`, {
    method: "PUT",
    body: payload,
  });
}
