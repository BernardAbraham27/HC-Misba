import { apiRequest } from "./api";

export const getBrands = () => apiRequest("/api/master/brands");
export const getBrandTypes = () => apiRequest("/api/master/brand-types");
export const getCategories = () => apiRequest("/api/master/categories");
export const getProductSizes = () => apiRequest("/api/master/product-sizes");
export const getProductStatuses = () => apiRequest("/api/master/product-statuses");
export const getOrderStatuses = () => apiRequest("/api/master/order-statuses");
export const getPaymentStatuses = () => apiRequest("/api/master/payment-statuses");
export const getCustomerStatuses = () => apiRequest("/api/master/customer-statuses");
export const getCouponStatuses = () => apiRequest("/api/master/coupon-statuses");
export const getInventoryStatuses = () => apiRequest("/api/master/inventory-statuses");
export const getEnquiryStatuses = () => apiRequest("/api/master/enquiry-statuses");
export const getRoles = () => apiRequest("/api/master/roles");
