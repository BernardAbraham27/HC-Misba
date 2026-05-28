import { apiRequest } from "./api";

const CART_STORAGE_KEY = "gg-guest-cart";
const CART_EVENT = "gg-cart-updated";

function readCartItems() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeCartItems(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
}

function toNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function mapCart(items) {
  const normalizedItems = items.map((item) => ({
    cartItemId: item.cartItemId,
    productId: item.productId,
    productName: item.productName,
    productImageUrl: item.productImageUrl || "",
    categoryName: item.categoryName || "",
    size: item.size,
    quantity: toNumber(item.quantity),
    unitPrice: toNumber(item.unitPrice),
    totalPrice: toNumber(item.quantity) * toNumber(item.unitPrice),
  }));

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const discount = 0;
  const deliveryCharge = subtotal >= 500 || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal + deliveryCharge - discount;

  return {
    items: normalizedItems,
    subtotal,
    discount,
    deliveryCharge,
    grandTotal,
  };
}

export function getCart() {
  return Promise.resolve(mapCart(readCartItems()));
}

export function getCartCount() {
  return readCartItems().reduce((sum, item) => sum + toNumber(item.quantity), 0);
}

export function onCartUpdated(callback) {
  const handler = () => callback(getCartCount());
  window.addEventListener(CART_EVENT, handler);
  return () => window.removeEventListener(CART_EVENT, handler);
}

export function addToCart(payload) {
  const items = readCartItems();
  const size = payload.size || "500ml";
  const existing = items.find(
    (item) => item.productId === payload.productId && item.size === size,
  );

  if (existing) {
    existing.quantity += toNumber(payload.quantity || 1);
  } else {
    items.push({
      cartItemId: payload.cartItemId || `${payload.productId}-${size}-${Date.now()}`,
      productId: payload.productId,
      productName: payload.productName,
      productImageUrl: payload.productImageUrl || "",
      categoryName: payload.categoryName || "",
      size,
      quantity: toNumber(payload.quantity || 1),
      unitPrice: toNumber(payload.unitPrice),
    });
  }

  writeCartItems(items);
  return getCart();
}

export function updateCartItem(payload) {
  const items = readCartItems().map((item) =>
    item.cartItemId === payload.cartItemId
      ? { ...item, quantity: Math.max(1, toNumber(payload.quantity)) }
      : item,
  );
  writeCartItems(items);
  return getCart();
}

export function removeCartItem(cartItemId) {
  const items = readCartItems().filter((item) => item.cartItemId !== cartItemId);
  writeCartItems(items);
  return getCart();
}

export function clearCart() {
  writeCartItems([]);
  return Promise.resolve();
}

export async function syncGuestCartToCustomerCart() {
  const localCart = mapCart(readCartItems());
  if (!localCart.items.length) {
    return localCart;
  }

  await apiRequest("/api/cart/clear", { method: "DELETE" });
  for (const item of localCart.items) {
    await apiRequest("/api/cart/add", {
      method: "POST",
      body: {
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
      },
    });
  }

  return apiRequest("/api/cart");
}
