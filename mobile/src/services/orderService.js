import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { API_BASE_URL, GUEST_ORDERS_KEY, unwrapResponse } from "./api";

export const paymentMethods = [
  { label: "Cash on Delivery", value: 1 },
  { label: "UPI Placeholder", value: 2 },
  { label: "Razorpay Placeholder", value: 3 },
];

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

async function readGuestOrders() {
  try {
    const raw = await AsyncStorage.getItem(GUEST_ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeGuestOrders(orders) {
  await AsyncStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(orders));
}

function getDeliveryCharge(subtotal) {
  return subtotal >= 500 || subtotal === 0 ? 0 : 50;
}

function mapOrder(order) {
  return {
    ...order,
    items: toArray(order.items).map((item) => ({
      ...item,
      productImageUrl: item.productImageUrl
        ? `${API_BASE_URL.replace(/\/$/, "")}${item.productImageUrl}`
        : "",
    })),
    subtotal: Number(order.subtotal ?? 0),
    deliveryCharge: Number(order.deliveryCharge ?? 0),
    grandTotal: Number(order.grandTotal ?? 0),
    status: order.status ?? 1,
    paymentStatus: order.paymentStatus ?? 1,
    paymentMethod: order.paymentMethod ?? 1,
    orderDate: order.orderDate || order.createdAt || new Date().toISOString(),
  };
}

async function createLocalGuestOrder(payload) {
  const subtotal = payload.items.reduce(
    (sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 0),
    0,
  );
  const deliveryCharge = getDeliveryCharge(subtotal);
  const order = {
    id: Date.now(),
    orderNumber: `GG${Date.now().toString().slice(-8)}`,
    customerName: payload.customerName,
    customerMobileNumber: payload.mobileNumber,
    subtotal,
    deliveryCharge,
    discountAmount: 0,
    grandTotal: subtotal + deliveryCharge,
    status: 1,
    paymentStatus: payload.paymentMethod === 1 ? 1 : 0,
    paymentMethod: payload.paymentMethod,
    orderDate: new Date().toISOString(),
    address: {
      fullName: payload.customerName,
      mobileNumber: payload.mobileNumber,
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

  const orders = await readGuestOrders();
  await writeGuestOrders([order, ...orders]);
  return order;
}

export function getOrderStatusMeta(status) {
  const current = typeof status === "string" ? status.toLowerCase() : Number(status);
  const steps = [
    { key: 1, label: "Placed", description: "Your order has been received." },
    { key: 2, label: "Confirmed", description: "Your order is confirmed." },
    { key: 3, label: "Packed", description: "Products are packed and ready." },
    { key: 4, label: "Shipped", description: "Your order is on the way." },
    { key: 5, label: "Delivered", description: "Order delivered successfully." },
  ];

  if (typeof current === "string") {
    const index = steps.findIndex((item) => item.label.toLowerCase() === current);
    return steps.map((item, idx) => ({ ...item, done: idx <= index, active: idx === index }));
  }

  const statusIndex = Math.min(Math.max(current, 1), steps.length) - 1;
  return steps.map((item, idx) => ({ ...item, done: idx <= statusIndex, active: idx === statusIndex }));
}

export function getPaymentStatusLabel(status) {
  if (status === 2 || String(status).toLowerCase() === "paid") {
    return "Paid";
  }
  if (status === 3 || String(status).toLowerCase() === "failed") {
    return "Failed";
  }
  return "Pending";
}

export function getPaymentMethodLabel(method) {
  const matched = paymentMethods.find((item) => item.value === Number(method));
  return matched?.label || "Cash on Delivery";
}

export async function createCheckoutOrder(payload, isLoggedIn) {
  if (Number(payload.paymentMethod) !== 1) {
    throw new Error("UPI and Razorpay are placeholders. Please choose Cash on Delivery for now.");
  }

  if (isLoggedIn) {
    try {
      const response = await api.post("/api/orders", {
        fullName: payload.customerName,
        mobileNumber: payload.mobileNumber,
        addressLine1: payload.addressLine1,
        addressLine2: payload.addressLine2,
        city: payload.city,
        state: payload.state,
        pincode: payload.pincode,
        landmark: payload.landmark,
        paymentMethod: payload.paymentMethod,
        notes: payload.notes || "",
      });
      return unwrapResponse(response);
    } catch {
      return createLocalGuestOrder(payload);
    }
  }

  try {
    const response = await api.post("/api/orders/guest", {
      customerName: payload.customerName,
      mobileNumber: payload.mobileNumber,
      email: payload.email || "",
      addressLine1: payload.addressLine1,
      addressLine2: payload.addressLine2,
      city: payload.city,
      state: payload.state,
      pincode: payload.pincode,
      landmark: payload.landmark,
      paymentMethod: payload.paymentMethod,
      notes: payload.notes || "",
      items: payload.items,
    });
    return unwrapResponse(response);
  } catch {
    return createLocalGuestOrder(payload);
  }
}

export async function getMyOrders() {
  const response = await api.get("/api/orders/my");
  return toArray(unwrapResponse(response)).map(mapOrder);
}

export async function getOrderById(id) {
  try {
    const response = await api.get(`/api/orders/${id}`);
    return mapOrder(unwrapResponse(response));
  } catch {
    const localOrders = await readGuestOrders();
    const localOrder = localOrders.find((order) => Number(order.id) === Number(id));
    if (!localOrder) {
      throw new Error("Order not found.");
    }
    return mapOrder(localOrder);
  }
}

export async function trackOrder(orderNumber, mobileNumber) {
  try {
    const response = await api.get("/api/orders/track", {
      params: { orderNumber, mobileNumber },
    });
    return mapOrder(unwrapResponse(response));
  } catch (error) {
    const localOrders = await readGuestOrders();
    const localOrder = localOrders.find(
      (order) =>
        String(order.orderNumber).toLowerCase() === String(orderNumber).toLowerCase() &&
        String(order.customerMobileNumber || order.mobileNumber) === String(mobileNumber),
    );
    if (localOrder) {
      return mapOrder(localOrder);
    }
    throw error;
  }
}
