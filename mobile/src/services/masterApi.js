import api, { unwrapResponse } from "./api";

export async function getBrands() {
  return unwrapResponse(await api.get("/api/master/brands"));
}

export async function getBrandTypes() {
  return unwrapResponse(await api.get("/api/master/brand-types"));
}

export async function getCategories() {
  return unwrapResponse(await api.get("/api/master/categories"));
}

export async function getProductSizes() {
  return unwrapResponse(await api.get("/api/master/product-sizes"));
}

export async function getProductStatuses() {
  return unwrapResponse(await api.get("/api/master/product-statuses"));
}

export async function getOrderStatuses() {
  return unwrapResponse(await api.get("/api/master/order-statuses"));
}

export async function getPaymentStatuses() {
  return unwrapResponse(await api.get("/api/master/payment-statuses"));
}

export async function getCustomerStatuses() {
  return unwrapResponse(await api.get("/api/master/customer-statuses"));
}

export async function getCouponStatuses() {
  return unwrapResponse(await api.get("/api/master/coupon-statuses"));
}

export async function getInventoryStatuses() {
  return unwrapResponse(await api.get("/api/master/inventory-statuses"));
}

export async function getEnquiryStatuses() {
  return unwrapResponse(await api.get("/api/master/enquiry-statuses"));
}

export async function getRoles() {
  return unwrapResponse(await api.get("/api/master/roles"));
}
