export const adminNavItems = [
  { label: "Dashboard", path: "/admin/dashboard", key: "dashboard" },
  { label: "Products", path: "/admin/products", key: "products" },
  { label: "Brands", path: "/admin/brands", key: "brands" },
  { label: "Categories", path: "/admin/categories", key: "categories" },
  { label: "Orders", path: "/admin/orders", key: "orders" },
  { label: "Customers", path: "/admin/customers", key: "customers" },
  { label: "Coupons", path: "/admin/coupons", key: "coupons" },
  { label: "Inventory", path: "/admin/inventory", key: "inventory" },
  { label: "Enquiries", path: "/admin/enquiries", key: "enquiries" },
  { label: "Settings", path: "/admin/settings", key: "settings" },
];

export const adminStatsMeta = [
  { key: "totalSales", label: "Total Sales", prefix: "Rs. " },
  { key: "totalOrders", label: "Orders" },
  { key: "totalProducts", label: "Products" },
  { key: "totalCustomers", label: "Customers" },
  { key: "pendingOrders", label: "Pending Orders" },
];

export const orderStatusOptions = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "OutForDelivery",
  "Delivered",
  "Cancelled",
  "Returned",
];

export const paymentStatusOptions = ["Pending", "Paid", "Failed", "Refunded"];

export const discountTypeOptions = [
  { label: "Percentage", value: 0 },
  { label: "Fixed", value: 1 },
];

export const enquiryStatusOptions = [
  "New",
  "Contacted",
  "Converted",
  "Closed",
];

export const defaultAdminSettings = {
  businessName: "God Grace Home Products",
  supportEmail: "support@godgracehomeproducts.com",
  supportPhone: "+91 98765 43210",
  frontendUrl: "http://localhost:5173",
  currency: "INR",
  lowStockThreshold: "20",
  bulkOrderNotifications: true,
};
