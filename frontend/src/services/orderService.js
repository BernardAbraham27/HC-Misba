import { apiRequest } from "./api";

const GUEST_ORDERS_STORAGE_KEY = "gg-guest-orders";

function readGuestOrders() {
  try {
    const raw = localStorage.getItem(GUEST_ORDERS_STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeGuestOrders(orders) {
  localStorage.setItem(GUEST_ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function createLocalGuestOrder(payload) {
  const subtotal = payload.items.reduce(
    (sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 0),
    0,
  );
  const deliveryCharge = subtotal >= 500 || subtotal === 0 ? 0 : 50;
  const order = {
    id: Date.now(),
    orderNumber: `GG${Date.now().toString().slice(-8)}`,
    customerName: payload.customerName,
    mobileNumber: payload.mobileNumber,
    email: payload.email || "",
    orderDate: new Date().toISOString(),
    status: 2,
    paymentMethod: payload.paymentMethod,
    paymentStatus: payload.paymentMethod === 2 ? 2 : 1,
    subtotal,
    discount: 0,
    deliveryCharge,
    grandTotal: subtotal + deliveryCharge,
    address: {
      fullName: payload.customerName,
      mobileNumber: payload.mobileNumber,
      email: payload.email || "",
      addressLine1: payload.addressLine1,
      addressLine2: payload.addressLine2,
      city: payload.city,
      state: payload.state,
      pincode: payload.pincode,
      landmark: payload.landmark,
    },
    items: payload.items.map((item) => ({
      ...item,
      totalPrice: Number(item.unitPrice || 0) * Number(item.quantity || 0),
    })),
  };

  const orders = readGuestOrders();
  writeGuestOrders([order, ...orders]);
  return order;
}

function findLocalGuestOrder(orderNumber, mobileNumber) {
  return readGuestOrders().find(
    (order) =>
      order.orderNumber?.toLowerCase() === orderNumber.toLowerCase() &&
      order.mobileNumber === mobileNumber,
  );
}

export async function createOrder(payload) {
  return apiRequest("/api/orders", {
    method: "POST",
    body: payload,
  });
}

export async function createGuestOrder(payload) {
  try {
    return await apiRequest("/api/orders/guest", {
      method: "POST",
      body: payload,
    });
  } catch {
    return createLocalGuestOrder(payload);
  }
}

export async function trackOrder(orderNumber, mobileNumber) {
  const params = new URLSearchParams({
    orderNumber,
    mobileNumber,
  });

  try {
    return await apiRequest(`/api/orders/track?${params.toString()}`);
  } catch (error) {
    const localOrder = findLocalGuestOrder(orderNumber, mobileNumber);
    if (localOrder) {
      return localOrder;
    }
    throw error;
  }
}

export function getMyOrders() {
  return apiRequest("/api/orders/my");
}

export function getOrderById(id) {
  return apiRequest(`/api/orders/${id}`);
}

export function cancelOrder(id) {
  return apiRequest(`/api/orders/${id}/cancel`, {
    method: "PUT",
  });
}

export function getAllOrders() {
  return apiRequest("/api/orders");
}

export function updateOrderStatus(id, status) {
  return apiRequest(`/api/orders/${id}/status`, {
    method: "PUT",
    body: { status },
  });
}

export function updatePaymentStatus(id, paymentStatus) {
  return apiRequest(`/api/orders/${id}/payment-status`, {
    method: "PUT",
    body: { paymentStatus },
  });
}
