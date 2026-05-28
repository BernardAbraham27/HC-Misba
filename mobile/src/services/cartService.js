import api, { unwrapResponse } from "./api";

export async function getCart() {
  const response = await api.get("/api/cart");
  return unwrapResponse(response);
}

export async function addCartItem(payload) {
  const response = await api.post("/api/cart", payload).catch(() =>
    api.post("/api/cart/add", payload),
  );
  return unwrapResponse(response);
}

export async function updateCartItem(payload) {
  const response = await api.put(`/api/cart/${payload.cartItemId}`, payload).catch(() =>
    api.put("/api/cart/update", payload),
  );
  return unwrapResponse(response);
}

export async function deleteCartItem(cartItemId) {
  const response = await api.delete(`/api/cart/${cartItemId}`).catch(() =>
    api.delete(`/api/cart/remove/${cartItemId}`),
  );
  return unwrapResponse(response);
}

export async function clearCart() {
  const response = await api.delete("/api/cart/clear");
  return unwrapResponse(response);
}
