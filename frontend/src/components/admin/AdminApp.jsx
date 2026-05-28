import { useEffect, useMemo, useState } from "react";
import AuthTabs from "../AuthTabs";
import {
  adminNavItems,
  adminStatsMeta,
  defaultAdminSettings,
  discountTypeOptions,
  enquiryStatusOptions,
  orderStatusOptions,
  paymentStatusOptions,
} from "../../data/admin";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";
const SETTINGS_STORAGE_KEY = "gg-admin-settings";

const EMPTY_PRODUCT_FORM = {
  name: "",
  brandId: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  price: "",
  discountPrice: "",
  stockQuantity: "",
  imageUrl: "https://placehold.co/600x600?text=God+Grace+Product",
  rating: "4.5",
  isBestSeller: false,
  isNewArrival: true,
  isActive: true,
  sizes: "500ml, 1L, 5L",
  benefits: "Removes tough stains, Helps maintain hygiene, Fresh fragrance",
  howToUse: "Use as directed on the product label.",
  safetyInstructions: "Keep away from children and avoid eye contact.",
};

const EMPTY_CATEGORY_FORM = {
  name: "",
  description: "",
  imageUrl: "https://placehold.co/600x400?text=God+Grace+Category",
  isActive: true,
};

const EMPTY_BRAND_FORM = {
  name: "God Grace Home Products",
  slug: "god-grace-home-products",
  logoUrl: "https://placehold.co/240x240?text=GG",
  description: "Trusted home care essentials from our own product range.",
  isOwnBrand: true,
  isActive: true,
};

const EMPTY_COUPON_FORM = {
  code: "",
  discountType: 0,
  discountValue: "",
  minimumOrderAmount: "",
  expiryDate: "",
  isActive: true,
};

function getStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? { ...defaultAdminSettings, ...JSON.parse(raw) } : defaultAdminSettings;
  } catch {
    return defaultAdminSettings;
  }
}

function formatCurrency(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(number);
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function toProductPayload(form) {
  return {
    name: form.name.trim(),
    brandId: Number(form.brandId),
    categoryId: Number(form.categoryId),
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
    stockQuantity: Number(form.stockQuantity),
    imageUrl: form.imageUrl.trim(),
    rating: Number(form.rating),
    isBestSeller: form.isBestSeller,
    isNewArrival: form.isNewArrival,
    isActive: form.isActive,
    sizes: form.sizes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    benefits: form.benefits
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    howToUse: form.howToUse.trim(),
    safetyInstructions: form.safetyInstructions.trim(),
  };
}

function toBrandPayload(form) {
  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
    logoUrl: form.logoUrl.trim(),
    description: form.description.trim(),
    isOwnBrand: form.isOwnBrand,
    isActive: form.isActive,
  };
}

function toCategoryPayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim(),
    isActive: form.isActive,
  };
}

function toCouponPayload(form) {
  return {
    code: form.code.trim().toUpperCase(),
    discountType: Number(form.discountType),
    discountValue: Number(form.discountValue),
    minimumOrderAmount: Number(form.minimumOrderAmount),
    expiryDate: new Date(form.expiryDate).toISOString(),
    isActive: form.isActive,
  };
}

function useAdminDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export default function AdminApp({ pathname, onNavigate, setToast: setGlobalToast }) {
  const { isAdmin, isAuthenticated, loading: authLoading, adminLogin, logout, token, user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [productsData, setProductsData] = useState({ items: [], totalCount: 0 });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [settings, setSettings] = useState(() => getStoredSettings());
  const [productQuery, setProductQuery] = useState({ search: "", pageNumber: 1, pageSize: 20 });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [brandForm, setBrandForm] = useState(EMPTY_BRAND_FORM);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM);
  const [couponForm, setCouponForm] = useState(EMPTY_COUPON_FORM);
  const [stockForm, setStockForm] = useState({ productId: "", quantityChange: "", remarks: "" });
  const [selectedHistoryProduct, setSelectedHistoryProduct] = useState("");
  const [activeModal, setActiveModal] = useState(null);

  const activePath =
    pathname === "/admin" ? "/admin/dashboard" : pathname.replace(/\/$/, "");
  const pageTitle = useMemo(() => {
    const current = adminNavItems.find((item) => item.path === activePath);
    return current ? `${current.label} | Admin Panel` : "Admin Panel";
  }, [activePath]);

  useAdminDocumentTitle(`God Grace Home Products Admin | ${pageTitle}`);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!pathname.startsWith("/admin")) return;
    if (pathname === "/admin") {
      onNavigate("/admin/dashboard", { replace: true });
      return;
    }
    if (pathname === "/admin/login" && isAuthenticated && isAdmin) {
      onNavigate("/admin/dashboard", { replace: true });
    }
  }, [isAdmin, isAuthenticated, onNavigate, pathname]);

  useEffect(() => {
    if (!token || pathname === "/admin/login") return;
    loadPageData(activePath);
  }, [token, activePath, productQuery.pageNumber]);

  useEffect(() => {
    if (!brands.length) return;
    setProductForm((current) => {
      if (current.brandId) return current;
      const defaultBrand = brands.find((brand) => brand.isOwnBrand) || brands[0];
      return { ...current, brandId: String(defaultBrand.id) };
    });
  }, [brands, productForm.brandId]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setGlobalToast?.({ type, message });
  };

  const handleLogout = () => {
    logout();
    onNavigate("/admin/login", { replace: true });
    showToast("success", "Admin session signed out.");
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const openProductCreate = () => {
    setEditingProduct(null);
    setProductForm({
      ...EMPTY_PRODUCT_FORM,
      brandId: brands.find((brand) => brand.isOwnBrand)?.id
        ? String(brands.find((brand) => brand.isOwnBrand)?.id)
        : "",
    });
    setActiveModal("product");
  };

  const openBrandCreate = () => {
    setEditingBrand(null);
    setBrandForm(EMPTY_BRAND_FORM);
    setActiveModal("brand");
  };

  const openCategoryCreate = () => {
    setEditingCategory(null);
    setCategoryForm(EMPTY_CATEGORY_FORM);
    setActiveModal("category");
  };

  const openCouponCreate = () => {
    setEditingCoupon(null);
    setCouponForm(EMPTY_COUPON_FORM);
    setActiveModal("coupon");
  };

  const openInventoryAdjustment = () => {
    setStockForm({ productId: "", quantityChange: "", remarks: "" });
    setActiveModal("inventory");
  };

  const withAsync = async (task, successMessage) => {
    try {
      setLoading(true);
      setError("");
      const result = await task();
      if (successMessage) showToast("success", successMessage);
      return result;
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Request failed.";
      setError(message);
      showToast("error", message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const loadPageData = async (path) => {
    if (!token) return;
    if (path === "/admin/dashboard") {
      await withAsync(async () => {
        const data = await apiRequest("/api/dashboard/admin", { token });
        setDashboard(data);
      });
      return;
    }

    if (path === "/admin/products") {
      await Promise.all([loadBrands(), loadCategories(), loadProducts()]);
      return;
    }

    if (path === "/admin/brands") {
      await loadBrands();
      return;
    }

    if (path === "/admin/categories") {
      await loadCategories();
      return;
    }

    if (path === "/admin/orders") {
      await withAsync(async () => {
        const data = await apiRequest("/api/orders", { token });
        setOrders(data || []);
      });
      return;
    }

    if (path === "/admin/customers") {
      await withAsync(async () => {
        const data = await apiRequest("/api/users", { token });
        setCustomers(data || []);
      });
      return;
    }

    if (path === "/admin/coupons") {
      await withAsync(async () => {
        const data = await apiRequest("/api/coupons", { token });
        setCoupons(data || []);
      });
      return;
    }

    if (path === "/admin/inventory") {
      await Promise.all([loadProducts(), loadLowStock()]);
      if (selectedHistoryProduct) {
        await loadInventoryHistory(selectedHistoryProduct);
      }
      return;
    }

    if (path === "/admin/enquiries") {
      await withAsync(async () => {
        const data = await apiRequest("/api/enquiries", { token });
        setEnquiries(data || []);
      });
    }
  };

  const loadProducts = async () =>
    withAsync(async () => {
      const search = productQuery.search ? `&search=${encodeURIComponent(productQuery.search)}` : "";
      const data = await apiRequest(
        `/api/products?pageNumber=${productQuery.pageNumber}&pageSize=${productQuery.pageSize}${search}`,
        { token },
      );
      setProductsData(data || { items: [], totalCount: 0 });
    });

  const loadBrands = async () =>
    withAsync(async () => {
      const data = await apiRequest("/api/brands", { token });
      setBrands(data || []);
    });

  const loadCategories = async () =>
    withAsync(async () => {
      const data = await apiRequest("/api/categories", { token });
      setCategories(data || []);
    });

  const loadLowStock = async () =>
    withAsync(async () => {
      const data = await apiRequest("/api/inventory/low-stock", { token });
      setLowStock(data || []);
    });

  const loadInventoryHistory = async (productId) =>
    withAsync(async () => {
      const data = await apiRequest(`/api/inventory/history/${productId}`, { token });
      setInventoryHistory(data || []);
      setSelectedHistoryProduct(String(productId));
    });

  const handleLogin = async (credentials) => {
    await withAsync(async () => {
      const data = await adminLogin(credentials);
      if (data.role !== "Admin") {
        logout();
        throw new Error("This account does not have admin access.");
      }
      onNavigate("/admin/dashboard", { replace: true });
      showToast("success", "Welcome back to the admin panel.");
    });
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    await withAsync(async () => {
      const payload = toProductPayload(productForm);
      if (editingProduct) {
        await apiRequest(`/api/products/${editingProduct.id}`, {
          token,
          method: "PUT",
          body: payload,
        });
      } else {
        await apiRequest("/api/products", {
          token,
          method: "POST",
          body: payload,
        });
      }
      setEditingProduct(null);
      setProductForm(EMPTY_PRODUCT_FORM);
      closeModal();
      await loadProducts();
    }, editingProduct ? "Product updated successfully." : "Product created successfully.");
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await withAsync(async () => {
      await apiRequest(`/api/products/${id}`, { token, method: "DELETE" });
      await loadProducts();
    }, "Product deleted successfully.");
  };

  const handleBrandSubmit = async (event) => {
    event.preventDefault();
    await withAsync(async () => {
      const payload = toBrandPayload(brandForm);
      if (editingBrand) {
        await apiRequest(`/api/brands/${editingBrand.id}`, {
          token,
          method: "PUT",
          body: payload,
        });
      } else {
        await apiRequest("/api/brands", {
          token,
          method: "POST",
          body: payload,
        });
      }
      setEditingBrand(null);
      setBrandForm(EMPTY_BRAND_FORM);
      closeModal();
      await loadBrands();
    }, editingBrand ? "Brand updated successfully." : "Brand created successfully.");
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm("Delete this brand?")) return;
    await withAsync(async () => {
      await apiRequest(`/api/brands/${id}`, { token, method: "DELETE" });
      await loadBrands();
    }, "Brand deleted successfully.");
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    await withAsync(async () => {
      const payload = toCategoryPayload(categoryForm);
      if (editingCategory) {
        await apiRequest(`/api/categories/${editingCategory.id}`, {
          token,
          method: "PUT",
          body: payload,
        });
      } else {
        await apiRequest("/api/categories", {
          token,
          method: "POST",
          body: payload,
        });
      }
      setEditingCategory(null);
      setCategoryForm(EMPTY_CATEGORY_FORM);
      closeModal();
      await loadCategories();
    }, editingCategory ? "Category updated successfully." : "Category created successfully.");
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await withAsync(async () => {
      await apiRequest(`/api/categories/${id}`, { token, method: "DELETE" });
      await loadCategories();
    }, "Category deleted successfully.");
  };

  const handleCouponSubmit = async (event) => {
    event.preventDefault();
    await withAsync(async () => {
      const payload = toCouponPayload(couponForm);
      if (editingCoupon) {
        await apiRequest(`/api/coupons/${editingCoupon.id}`, {
          token,
          method: "PUT",
          body: payload,
        });
      } else {
        await apiRequest("/api/coupons", {
          token,
          method: "POST",
          body: payload,
        });
      }
      setEditingCoupon(null);
      setCouponForm(EMPTY_COUPON_FORM);
      closeModal();
      const data = await apiRequest("/api/coupons", { token });
      setCoupons(data || []);
    }, editingCoupon ? "Coupon updated successfully." : "Coupon created successfully.");
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    await withAsync(async () => {
      await apiRequest(`/api/coupons/${id}`, { token, method: "DELETE" });
      const data = await apiRequest("/api/coupons", { token });
      setCoupons(data || []);
    }, "Coupon deleted successfully.");
  };

  const handleOrderStatusUpdate = async (id, status) => {
    await withAsync(async () => {
      await apiRequest(`/api/orders/${id}/status`, {
        token,
        method: "PUT",
        body: { status },
      });
      const data = await apiRequest("/api/orders", { token });
      setOrders(data || []);
    }, "Order status updated.");
  };

  const handlePaymentStatusUpdate = async (id, paymentStatus) => {
    await withAsync(async () => {
      await apiRequest(`/api/orders/${id}/payment-status`, {
        token,
        method: "PUT",
        body: { paymentStatus },
      });
      const data = await apiRequest("/api/orders", { token });
      setOrders(data || []);
    }, "Payment status updated.");
  };

  const handleInvoiceView = async (id) => {
    await withAsync(async () => {
      const data = await apiRequest(`/api/orders/${id}/invoice`, { token });
      setSelectedInvoice(data);
    });
  };

  const handleCustomerStatus = async (id, block) => {
    await withAsync(async () => {
      await apiRequest(`/api/users/${id}/${block ? "block" : "unblock"}`, {
        token,
        method: "PUT",
      });
      const data = await apiRequest("/api/users", { token });
      setCustomers(data || []);
    }, `Customer ${block ? "blocked" : "unblocked"} successfully.`);
  };

  const handleStockUpdate = async (event) => {
    event.preventDefault();
    await withAsync(async () => {
      await apiRequest("/api/inventory/update-stock", {
        token,
        method: "POST",
        body: {
          productId: Number(stockForm.productId),
          quantityChange: Number(stockForm.quantityChange),
          remarks: stockForm.remarks.trim(),
        },
      });
      setStockForm({ productId: "", quantityChange: "", remarks: "" });
      closeModal();
      await Promise.all([loadProducts(), loadLowStock()]);
      if (selectedHistoryProduct) {
        await loadInventoryHistory(selectedHistoryProduct);
      }
    }, "Inventory updated successfully.");
  };

  const handleEnquiryStatusUpdate = async (id, status) => {
    await withAsync(async () => {
      await apiRequest(`/api/enquiries/${id}/status`, {
        token,
        method: "PUT",
        body: { status },
      });
      const data = await apiRequest("/api/enquiries", { token });
      setEnquiries(data || []);
    }, "Enquiry status updated.");
  };

  const handleEnquiryRemarks = async (id, remarks) => {
    await withAsync(async () => {
      await apiRequest(`/api/enquiries/${id}/remarks`, {
        token,
        method: "PUT",
        body: { remarks },
      });
      const data = await apiRequest("/api/enquiries", { token });
      setEnquiries(data || []);
    }, "Enquiry remarks saved.");
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    await withAsync(async () => {
      await apiRequest(`/api/enquiries/${id}`, { token, method: "DELETE" });
      const data = await apiRequest("/api/enquiries", { token });
      setEnquiries(data || []);
    }, "Enquiry deleted successfully.");
  };

  const saveSettings = (event) => {
    event.preventDefault();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    showToast("success", "Admin settings saved locally.");
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      brandId: String(product.brandId),
      categoryId: String(product.categoryId),
      shortDescription: product.shortDescription,
      description: product.description,
      price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : "",
      stockQuantity: String(product.stockQuantity),
      imageUrl: product.imageUrl,
      rating: String(product.rating),
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
      isActive: product.isActive,
      sizes: product.sizes.join(", "),
      benefits: product.benefits.join(", "),
      howToUse: product.howToUse,
      safetyInstructions: product.safetyInstructions,
    });
    setActiveModal("product");
  };

  const startEditBrand = (brand) => {
    setEditingBrand(brand);
    setBrandForm({
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl || "https://placehold.co/240x240?text=Brand",
      description: brand.description,
      isOwnBrand: brand.isOwnBrand,
      isActive: brand.isActive,
    });
    setActiveModal("brand");
  };

  const startEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl || "https://placehold.co/600x400?text=God+Grace+Category",
      isActive: category.isActive,
    });
    setActiveModal("category");
  };

  const startEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minimumOrderAmount: String(coupon.minimumOrderAmount),
      expiryDate: new Date(coupon.expiryDate).toISOString().slice(0, 10),
      isActive: coupon.isActive,
    });
    setActiveModal("coupon");
  };

  if (pathname === "/admin/login" || !token) {
    return (
      <>
        <AdminLogin
          loading={loading || authLoading}
          error={error}
          onLogin={handleLogin}
          onBackToStore={() => onNavigate("/", { replace: true })}
          onNavigateCustomerLogin={() => onNavigate("/login")}
          onNavigateCustomerRegister={() => onNavigate("/register")}
          onNavigateAdminLogin={() => onNavigate("/admin/login", { replace: true })}
        />
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside
          className={classNames(
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950/95 p-6 backdrop-blur-xl transition-transform lg:translate-x-0",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate("/", { replace: true })}
              className="flex items-center gap-3 text-left"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 text-sm font-bold text-white">
                GG
              </span>
              <span>
                <span className="block text-sm font-bold uppercase tracking-[0.22em] text-white">
                  God Grace
                </span>
                <span className="block text-xs text-slate-400">Admin Panel</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 lg:hidden"
            >
              Close
            </button>
          </div>

          <nav className="mt-8 grid gap-2" aria-label="Admin navigation">
            {adminNavItems.map((item) => {
              const isActive = item.path === activePath;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileNavOpen(false);
                  }}
                  className={classNames(
                    "rounded-2xl px-4 py-3 text-left text-sm font-medium transition",
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-50">
                  <p className="font-semibold">Signed in as</p>
            <p className="mt-1">{user?.fullName}</p>
            <p className="text-xs text-emerald-100/80">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Sign Out
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileNavOpen((current) => !current)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white lg:hidden"
                >
                  Menu
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
                    God Grace Home Products
                  </p>
                  <h1 className="text-2xl font-semibold text-white">{pageTitle}</h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <button
                  type="button"
                  onClick={() => onNavigate("/", { replace: true })}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  View Storefront
                </button>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-sm text-slate-300">
                  <p className="font-semibold text-white">{user?.fullName}</p>
                  <p>{user?.email}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {error ? (
              <div className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            {activePath === "/admin/dashboard" ? (
              <DashboardPage dashboard={dashboard} />
            ) : null}

            {activePath === "/admin/products" ? (
              <ProductsPage
                brands={brands}
                categories={categories}
                editingProduct={editingProduct}
                form={productForm}
                isModalOpen={activeModal === "product"}
                loading={loading}
                productsData={productsData}
                query={productQuery}
                onCloseModal={closeModal}
                onCreate={openProductCreate}
                onDelete={handleDeleteProduct}
                onEdit={startEditProduct}
                onFormChange={setProductForm}
                onQueryChange={setProductQuery}
                onRefresh={loadProducts}
                onReset={() => {
                  setEditingProduct(null);
                  setProductForm(EMPTY_PRODUCT_FORM);
                  closeModal();
                }}
                onSubmit={handleProductSubmit}
              />
            ) : null}

            {activePath === "/admin/brands" ? (
              <BrandsPage
                brands={brands}
                editingBrand={editingBrand}
                form={brandForm}
                isModalOpen={activeModal === "brand"}
                loading={loading}
                onCloseModal={closeModal}
                onCreate={openBrandCreate}
                onDelete={handleDeleteBrand}
                onEdit={startEditBrand}
                onFormChange={setBrandForm}
                onReset={() => {
                  setEditingBrand(null);
                  setBrandForm(EMPTY_BRAND_FORM);
                  closeModal();
                }}
                onSubmit={handleBrandSubmit}
              />
            ) : null}

            {activePath === "/admin/categories" ? (
              <CategoriesPage
                categories={categories}
                editingCategory={editingCategory}
                form={categoryForm}
                isModalOpen={activeModal === "category"}
                loading={loading}
                onCloseModal={closeModal}
                onCreate={openCategoryCreate}
                onDelete={handleDeleteCategory}
                onEdit={startEditCategory}
                onFormChange={setCategoryForm}
                onReset={() => {
                  setEditingCategory(null);
                  setCategoryForm(EMPTY_CATEGORY_FORM);
                  closeModal();
                }}
                onSubmit={handleCategorySubmit}
              />
            ) : null}

            {activePath === "/admin/orders" ? (
              <OrdersPage
                invoice={selectedInvoice}
                loading={loading}
                orders={orders}
                onInvoice={handleInvoiceView}
                onPaymentStatusChange={handlePaymentStatusUpdate}
                onStatusChange={handleOrderStatusUpdate}
              />
            ) : null}

            {activePath === "/admin/customers" ? (
              <CustomersPage
                customers={customers}
                loading={loading}
                onToggleBlock={handleCustomerStatus}
              />
            ) : null}

            {activePath === "/admin/coupons" ? (
              <CouponsPage
                coupons={coupons}
                editingCoupon={editingCoupon}
                form={couponForm}
                isModalOpen={activeModal === "coupon"}
                loading={loading}
                onCloseModal={closeModal}
                onCreate={openCouponCreate}
                onDelete={handleDeleteCoupon}
                onEdit={startEditCoupon}
                onFormChange={setCouponForm}
                onReset={() => {
                  setEditingCoupon(null);
                  setCouponForm(EMPTY_COUPON_FORM);
                  closeModal();
                }}
                onSubmit={handleCouponSubmit}
              />
            ) : null}

            {activePath === "/admin/inventory" ? (
              <InventoryPage
                history={inventoryHistory}
                isModalOpen={activeModal === "inventory"}
                loading={loading}
                lowStock={lowStock}
                onCloseModal={closeModal}
                products={productsData.items}
                onOpenAdjustment={openInventoryAdjustment}
                selectedHistoryProduct={selectedHistoryProduct}
                stockForm={stockForm}
                onFormChange={setStockForm}
                onHistoryLoad={loadInventoryHistory}
                onSubmit={handleStockUpdate}
              />
            ) : null}

            {activePath === "/admin/enquiries" ? (
              <EnquiriesPage
                enquiries={enquiries}
                loading={loading}
                onDelete={handleDeleteEnquiry}
                onRemarksSave={handleEnquiryRemarks}
                onStatusChange={handleEnquiryStatusUpdate}
              />
            ) : null}

            {activePath === "/admin/settings" ? (
              <SettingsPage
                loading={loading}
                settings={settings}
                onChange={setSettings}
                onSubmit={saveSettings}
              />
            ) : null}
          </main>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}

function AdminLogin({
  loading,
  error,
  onLogin,
  onBackToStore,
  onNavigateCustomerLogin,
  onNavigateCustomerRegister,
  onNavigateAdminLogin,
}) {
  const [email, setEmail] = useState("admin@mispa.com");
  const [password, setPassword] = useState("Admin@123");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#111827_100%)] px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
            Separate Admin Workspace
          </span>
          <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
            Manage God Grace Home Products with confidence.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            This admin panel is kept separate from the customer storefront and gives
            your team a clean enterprise-grade workspace for products, orders,
            customers, coupons, inventory, enquiries, and settings.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Admin-only protected routes",
              "Live product and order management",
              "Inventory and enquiry operations",
              "Responsive dashboard with clean workflows",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white p-8 shadow-2xl sm:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
                Admin Login
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                Sign in to continue
              </h2>
            </div>
            <button
              type="button"
              onClick={onBackToStore}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Back to store
            </button>
          </div>
          <div className="mt-6">
            <AuthTabs
              active="admin-login"
              onNavigate={(path) => {
                if (path === "/login") onNavigateCustomerLogin();
                else if (path === "/register") onNavigateCustomerRegister();
                else onNavigateAdminLogin();
              }}
            />
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              onLogin({ email, password });
            }}
          >
            <Field label="Admin Email">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                placeholder="admin@mispa.com"
                required
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                placeholder="Enter password"
                required
              />
            </Field>
            {error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <p className="font-semibold">Admin demo credentials</p>
              <p className="mt-1">Email: admin@mispa.com</p>
              <p>Password: Admin@123</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Access Admin Panel"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function DashboardPage({ dashboard }) {
  if (!dashboard) {
    return <LoadingPanel label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {adminStatsMeta.map((item) => (
          <MetricCard
            key={item.key}
            label={item.label}
            value={`${item.prefix || ""}${dashboard[item.key] ?? 0}`}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card title="Recent Orders" description="Latest placed orders across the platform.">
          <div className="space-y-3">
            {(dashboard.recentOrders || []).map((order) => (
              <div
                key={order.orderId}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{order.orderNumber}</p>
                  <p className="text-sm text-slate-400">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-300">{formatCurrency(order.grandTotal)}</p>
                  <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Low Stock Alerts" description="Products that need immediate replenishment.">
          <div className="space-y-3">
            {(dashboard.lowStockProducts || []).length ? (
              dashboard.lowStockProducts.map((product) => (
                <div
                  key={product.productId}
                  className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3"
                >
                  <p className="font-medium text-white">{product.productName}</p>
                  <p className="text-sm text-amber-200">Stock left: {product.stockQuantity}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No low stock products right now.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Top Selling Products" description="Best performers by quantity sold.">
          <div className="space-y-3">
            {(dashboard.topSellingProducts || []).map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3"
              >
                <span className="font-medium text-white">{product.productName}</span>
                <span className="text-sm text-cyan-300">{product.quantitySold} sold</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Monthly Sales Summary" description="Quick visual of recent sales momentum.">
          <div className="space-y-4">
            {(dashboard.monthlySalesSummary || []).map((entry) => {
              const maxSales = Math.max(...dashboard.monthlySalesSummary.map((item) => item.sales), 1);
              const width = `${Math.max((entry.sales / maxSales) * 100, 10)}%`;
              return (
                <div key={entry.month}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <span>{entry.month}</span>
                    <span>{formatCurrency(entry.sales)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProductsPage({
  brands,
  categories,
  editingProduct,
  form,
  isModalOpen,
  loading,
  productsData,
  query,
  onCloseModal,
  onCreate,
  onDelete,
  onEdit,
  onFormChange,
  onQueryChange,
  onRefresh,
  onReset,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <Card
        title="Product Management"
        description="Create, update, search, and maintain your full product catalog."
        action={
          <div className="flex flex-wrap gap-3">
            <input
              type="search"
              value={query.search}
              onChange={(event) =>
                onQueryChange((current) => ({
                  ...current,
                  pageNumber: 1,
                  search: event.target.value,
                }))
              }
              placeholder="Search products"
              className="admin-input w-56"
            />
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={onCreate}
              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Add Product
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {productsData.items?.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="h-20 w-20 rounded-2xl border border-slate-700 bg-white object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{product.name}</p>
                    <p className="text-sm text-slate-400">
                      {product.brandName} • {product.categoryName}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{product.shortDescription}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={classNames(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          product.isOwnBrand
                            ? "bg-emerald-500/20 text-emerald-100"
                            : "bg-sky-500/20 text-sky-100",
                        )}
                      >
                        {product.isOwnBrand ? "Own Brand" : "Partner Brand"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-4 lg:min-w-[420px]">
                  <InfoPill label="Price" value={formatCurrency(product.price)} />
                  <InfoPill label="Discount" value={formatCurrency(product.discountPrice || 0)} />
                  <InfoPill label="Stock" value={product.stockQuantity} />
                  <InfoPill label="Rating" value={product.rating} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(product.id)}
                  className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!productsData.items?.length ? (
            <p className="text-sm text-slate-400">No products found.</p>
          ) : null}
        </div>
      </Card>

      <ModalShell
        open={isModalOpen}
        title={editingProduct ? "Edit Product" : "Add Product"}
        description="Maintain pricing, stock, descriptions, and merchandising flags."
        onClose={onCloseModal}
      >
        <form className="space-y-4" onSubmit={onSubmit}>
          <Field label="Product Name">
            <input
              className="admin-input"
              value={form.name}
              onChange={(event) => onFormChange({ ...form, name: event.target.value })}
              required
            />
          </Field>
          <Field label="Brand">
            <select
              className="admin-input"
              value={form.brandId}
              onChange={(event) => onFormChange({ ...form, brandId: event.target.value })}
              required
            >
              <option value="">Select brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                  {brand.isOwnBrand ? " (Own Brand)" : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select
              className="admin-input"
              value={form.categoryId}
              onChange={(event) => onFormChange({ ...form, categoryId: event.target.value })}
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Short Description">
            <textarea
              className="admin-input min-h-[84px]"
              value={form.shortDescription}
              onChange={(event) =>
                onFormChange({ ...form, shortDescription: event.target.value })
              }
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              className="admin-input min-h-[120px]"
              value={form.description}
              onChange={(event) => onFormChange({ ...form, description: event.target.value })}
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price">
              <input type="number" step="0.01" className="admin-input" value={form.price} onChange={(event) => onFormChange({ ...form, price: event.target.value })} required />
            </Field>
            <Field label="Discount Price">
              <input type="number" step="0.01" className="admin-input" value={form.discountPrice} onChange={(event) => onFormChange({ ...form, discountPrice: event.target.value })} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Stock Quantity">
              <input type="number" className="admin-input" value={form.stockQuantity} onChange={(event) => onFormChange({ ...form, stockQuantity: event.target.value })} required />
            </Field>
            <Field label="Rating">
              <input type="number" step="0.1" className="admin-input" value={form.rating} onChange={(event) => onFormChange({ ...form, rating: event.target.value })} />
            </Field>
          </div>
          <Field label="Image URL">
            <input className="admin-input" value={form.imageUrl} onChange={(event) => onFormChange({ ...form, imageUrl: event.target.value })} required />
          </Field>
          <Field label="Sizes (comma separated)">
            <input className="admin-input" value={form.sizes} onChange={(event) => onFormChange({ ...form, sizes: event.target.value })} />
          </Field>
          <Field label="Benefits (comma separated)">
            <textarea className="admin-input min-h-[84px]" value={form.benefits} onChange={(event) => onFormChange({ ...form, benefits: event.target.value })} />
          </Field>
          <Field label="How To Use">
            <textarea className="admin-input min-h-[84px]" value={form.howToUse} onChange={(event) => onFormChange({ ...form, howToUse: event.target.value })} required />
          </Field>
          <Field label="Safety Instructions">
            <textarea className="admin-input min-h-[84px]" value={form.safetyInstructions} onChange={(event) => onFormChange({ ...form, safetyInstructions: event.target.value })} required />
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Checkbox label="Best Seller" checked={form.isBestSeller} onChange={(checked) => onFormChange({ ...form, isBestSeller: checked })} />
            <Checkbox label="New Arrival" checked={form.isNewArrival} onChange={(checked) => onFormChange({ ...form, isNewArrival: checked })} />
            <Checkbox label="Active" checked={form.isActive} onChange={(checked) => onFormChange({ ...form, isActive: checked })} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60">
              {editingProduct ? "Update Product" : "Create Product"}
            </button>
            <button type="button" onClick={onReset} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Reset
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}

function BrandsPage({
  brands,
  editingBrand,
  form,
  isModalOpen,
  loading,
  onCloseModal,
  onCreate,
  onDelete,
  onEdit,
  onFormChange,
  onReset,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <Card
        title="Brand Management"
        description="Add, edit, enable, and organize own-brand and partner-brand records."
        action={
          <button
            type="button"
            onClick={onCreate}
            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Add Brand
          </button>
        }
      >
        <div className="space-y-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={brand.logoUrl || "https://placehold.co/240x240?text=Brand"}
                    alt={brand.name}
                    loading="lazy"
                    className="h-20 w-20 rounded-2xl border border-slate-700 bg-white object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{brand.name}</p>
                    <p className="text-sm text-slate-400">{brand.description}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {brand.productCount} product{brand.productCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={classNames(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      brand.isOwnBrand
                        ? "bg-emerald-500/20 text-emerald-100"
                        : "bg-sky-500/20 text-sky-100",
                    )}
                  >
                    {brand.isOwnBrand ? "Own Brand" : "Partner Brand"}
                  </span>
                  <span
                    className={classNames(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      brand.isActive
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "bg-slate-700 text-slate-200",
                    )}
                  >
                    {brand.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEdit(brand)}
                    className="rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(brand.id)}
                    className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!brands.length ? <p className="text-sm text-slate-400">No brands created yet.</p> : null}
        </div>
      </Card>

      <ModalShell
        open={isModalOpen}
        title={editingBrand ? "Edit Brand" : "Add Brand"}
        description="Manage brand identity, logo URL, and whether a brand is own-brand or partner-brand."
        onClose={onCloseModal}
      >
        <form className="space-y-4" onSubmit={onSubmit}>
          <Field label="Brand Name">
            <input
              className="admin-input"
              value={form.name}
              onChange={(event) => onFormChange({ ...form, name: event.target.value })}
              required
            />
          </Field>
          <Field label="Slug">
            <input
              className="admin-input"
              value={form.slug}
              onChange={(event) => onFormChange({ ...form, slug: event.target.value })}
              required
            />
          </Field>
          <Field label="Logo URL">
            <input
              className="admin-input"
              value={form.logoUrl}
              onChange={(event) => onFormChange({ ...form, logoUrl: event.target.value })}
            />
          </Field>
          <Field label="Description">
            <textarea
              className="admin-input min-h-[120px]"
              value={form.description}
              onChange={(event) => onFormChange({ ...form, description: event.target.value })}
              required
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Checkbox
              label="Own Brand"
              checked={form.isOwnBrand}
              onChange={(checked) => onFormChange({ ...form, isOwnBrand: checked })}
            />
            <Checkbox
              label="Brand Active"
              checked={form.isActive}
              onChange={(checked) => onFormChange({ ...form, isActive: checked })}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
            >
              {editingBrand ? "Update Brand" : "Create Brand"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Reset
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}

function CategoriesPage({
  categories,
  editingCategory,
  form,
  isModalOpen,
  loading,
  onCloseModal,
  onCreate,
  onDelete,
  onEdit,
  onFormChange,
  onReset,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <Card
        title="Category Management"
        description="Control category structure and storefront grouping."
        action={
          <button
            type="button"
            onClick={onCreate}
            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Add Category
          </button>
        }
      >
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={category.imageUrl || "https://placehold.co/600x400?text=Category"}
                  alt={category.name}
                  className="h-16 w-16 rounded-2xl border border-slate-700 bg-white object-cover"
                />
                <div>
                  <p className="font-semibold text-white">{category.name}</p>
                  <p className="text-sm text-slate-400">{category.description}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {category.productCount} product{category.productCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(category)}
                  className="rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(category.id)}
                  className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ModalShell
        open={isModalOpen}
        title={editingCategory ? "Edit Category" : "Add Category"}
        description="Create or update a clean product taxonomy."
        onClose={onCloseModal}
      >
        <form className="space-y-4" onSubmit={onSubmit}>
          <Field label="Category Name">
            <input
              className="admin-input"
              value={form.name}
              onChange={(event) => onFormChange({ ...form, name: event.target.value })}
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              className="admin-input min-h-[120px]"
              value={form.description}
              onChange={(event) => onFormChange({ ...form, description: event.target.value })}
              required
            />
          </Field>
          <Field label="Image URL">
            <input
              className="admin-input"
              value={form.imageUrl}
              onChange={(event) => onFormChange({ ...form, imageUrl: event.target.value })}
            />
          </Field>
          <Checkbox
            label="Category Active"
            checked={form.isActive}
            onChange={(checked) => onFormChange({ ...form, isActive: checked })}
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
            >
              {editingCategory ? "Update Category" : "Create Category"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Reset
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}

function OrdersPage({ invoice, loading, orders, onInvoice, onPaymentStatusChange, onStatusChange }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = !search
        || order.orderNumber.toLowerCase().includes(search.toLowerCase())
        || (order.customerMobileNumber || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !statusFilter || String(order.status) === statusFilter;
      const matchesPayment = !paymentFilter || String(order.paymentStatus) === paymentFilter;
      const orderDate = new Date(order.orderDate || order.createdAt).toISOString().slice(0, 10);
      const matchesDate = !dateFilter || orderDate === dateFilter;

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [dateFilter, orders, paymentFilter, search, statusFilter]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card
        title="Order Management"
        description="Track orders, update statuses, and view invoice data."
        action={
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Order no. or mobile"
              className="admin-input min-w-[180px]"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="admin-input min-w-[150px]"
            >
              <option value="">All statuses</option>
              {orderStatusOptions.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="admin-input min-w-[150px]"
            >
              <option value="">All payments</option>
              {paymentStatusOptions.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="admin-input min-w-[160px]"
            />
          </div>
        }
      >
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-semibold text-white">{order.orderNumber}</p>
                  <p className="text-sm text-slate-400">{order.customerName}</p>
                  <p className="mt-1 text-xs text-slate-500">{order.customerMobileNumber}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    {order.items?.length || 0} item{order.items?.length === 1 ? "" : "s"} • {formatCurrency(order.grandTotal)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(order.orderDate || order.createdAt)}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    className="admin-input min-w-[180px]"
                    value={order.status}
                    onChange={(event) => onStatusChange(order.id, Number(event.target.value))}
                  >
                    {orderStatusOptions.map((label, index) => (
                      <option key={label} value={index + 1}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="admin-input min-w-[180px]"
                    value={order.paymentStatus}
                    onChange={(event) => onPaymentStatusChange(order.id, Number(event.target.value))}
                  >
                    {paymentStatusOptions.map((label, index) => (
                      <option key={label} value={index + 1}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {order.items?.map((item) => (
                  <span
                    key={`${order.id}-${item.productId}-${item.size}`}
                    className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-100"
                  >
                    {item.productName} x {item.quantity}
                  </span>
                ))}
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => onInvoice(order.id)}
                className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Invoice
              </button>
            </div>
          ))}
          {!filteredOrders.length ? <p className="text-sm text-slate-400">No orders match the selected filters.</p> : null}
        </div>
      </Card>

      <Card title="Invoice Preview" description="Quick invoice reference for admin operations.">
        {invoice ? (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-lg font-semibold text-white">{invoice.orderNumber}</p>
              <p>{invoice.customerName}</p>
              <p>{invoice.customerEmail}</p>
              <p className="mt-2">{invoice.deliveryAddress}</p>
              <p className="mt-3 text-emerald-300">{formatCurrency(invoice.grandTotal)}</p>
            </div>
            <div className="space-y-3">
              {invoice.items?.map((item) => (
                <div key={`${invoice.orderNumber}-${item.productId}-${item.size}`} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="font-medium text-white">{item.productName}</p>
                  <p className="text-slate-400">{item.size}</p>
                  <p className="mt-1">
                    {item.quantity} x {formatCurrency(item.unitPrice)} = {formatCurrency(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Select an order to load invoice data.</p>
        )}
      </Card>
    </div>
  );
}

function CustomersPage({ customers, loading, onToggleBlock }) {
  return (
    <Card title="Customer Management" description="View customers and manage account access.">
      <div className="overflow-hidden rounded-3xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900/70 text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Mobile</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t border-slate-800">
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{customer.fullName}</p>
                    <p className="text-xs text-slate-500">{customer.email}</p>
                  </td>
                  <td className="px-4 py-4">{customer.mobileNumber}</td>
                  <td className="px-4 py-4">
                    <span
                      className={classNames(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        customer.isBlocked
                          ? "bg-rose-500/10 text-rose-100"
                          : "bg-emerald-500/10 text-emerald-100",
                      )}
                    >
                      {customer.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-4">{formatDate(customer.createdAt)}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => onToggleBlock(customer.id, !customer.isBlocked)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {customer.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

function CouponsPage({
  coupons,
  editingCoupon,
  form,
  isModalOpen,
  loading,
  onCloseModal,
  onCreate,
  onDelete,
  onEdit,
  onFormChange,
  onReset,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <Card
        title="Coupon Management"
        description="Create and manage promotional pricing rules."
        action={
          <button
            type="button"
            onClick={onCreate}
            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Add Coupon
          </button>
        }
      >
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{coupon.code}</p>
                  <p className="text-sm text-slate-400">
                    {coupon.discountType === 0 ? `${coupon.discountValue}% off` : `${formatCurrency(coupon.discountValue)} off`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Min order {formatCurrency(coupon.minimumOrderAmount)} • Expires {formatDate(coupon.expiryDate)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span
                    className={classNames(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      coupon.isActive
                        ? "bg-emerald-500/10 text-emerald-100"
                        : "bg-slate-700 text-slate-200",
                    )}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEdit(coupon)}
                    className="rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(coupon.id)}
                    className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!coupons.length ? <p className="text-sm text-slate-400">No coupons configured.</p> : null}
        </div>
      </Card>

      <ModalShell
        open={isModalOpen}
        title={editingCoupon ? "Edit Coupon" : "Create Coupon"}
        description="Set discount types, conditions, and validity."
        onClose={onCloseModal}
      >
        <form className="space-y-4" onSubmit={onSubmit}>
          <Field label="Coupon Code">
            <input
              className="admin-input uppercase"
              value={form.code}
              onChange={(event) => onFormChange({ ...form, code: event.target.value })}
              required
            />
          </Field>
          <Field label="Discount Type">
            <select
              className="admin-input"
              value={form.discountType}
              onChange={(event) => onFormChange({ ...form, discountType: event.target.value })}
            >
              {discountTypeOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Discount Value">
              <input
                type="number"
                step="0.01"
                className="admin-input"
                value={form.discountValue}
                onChange={(event) =>
                  onFormChange({ ...form, discountValue: event.target.value })
                }
                required
              />
            </Field>
            <Field label="Minimum Order Amount">
              <input
                type="number"
                step="0.01"
                className="admin-input"
                value={form.minimumOrderAmount}
                onChange={(event) =>
                  onFormChange({ ...form, minimumOrderAmount: event.target.value })
                }
                required
              />
            </Field>
          </div>
          <Field label="Expiry Date">
            <input
              type="date"
              className="admin-input"
              value={form.expiryDate}
              onChange={(event) => onFormChange({ ...form, expiryDate: event.target.value })}
              required
            />
          </Field>
          <Checkbox
            label="Coupon Active"
            checked={form.isActive}
            onChange={(checked) => onFormChange({ ...form, isActive: checked })}
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
            >
              {editingCoupon ? "Update Coupon" : "Create Coupon"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Reset
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}

function InventoryPage({
  history,
  isModalOpen,
  loading,
  lowStock,
  onCloseModal,
  products,
  selectedHistoryProduct,
  stockForm,
  onFormChange,
  onHistoryLoad,
  onOpenAdjustment,
  onSubmit,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <Card
          title="Stock Adjustment"
          description="Open a popup to update inventory without losing sight of your current stock data."
          action={
            <button
              type="button"
              onClick={onOpenAdjustment}
              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Adjust Stock
            </button>
          }
        >
          <p className="text-sm leading-7 text-slate-400">
            Review the low-stock alerts and product history first, then open the stock adjustment form in a popup when you are ready to update inventory.
          </p>
        </Card>

        <Card title="Low Stock Alerts" description="Products that need replenishment first.">
          <div className="space-y-3">
            {lowStock.length ? (
              lowStock.map((item) => (
                <button
                  key={item.productId}
                  type="button"
                  onClick={() => onHistoryLoad(item.productId)}
                  className="flex w-full items-center justify-between rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-left transition hover:bg-amber-500/20"
                >
                  <span className="font-medium text-white">{item.productName}</span>
                  <span className="text-sm text-amber-100">{item.stockQuantity} left</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-400">No low stock alerts currently.</p>
            )}
          </div>
        </Card>
      </div>

      <Card title="Inventory History" description="Review stock movement entries for the selected product.">
        <div className="mb-4">
          <select
            className="admin-input max-w-sm"
            value={selectedHistoryProduct}
            onChange={(event) => {
              if (event.target.value) onHistoryLoad(event.target.value);
            }}
          >
            <option value="">Select product to load history</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          {history.length ? (
            history.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{entry.remarks}</p>
                  <span className="text-xs text-cyan-300">{formatDate(entry.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  Previous: {entry.previousStock} • Change: {entry.quantityChanged} • New: {entry.newStock}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">Load a product to view inventory movement history.</p>
          )}
        </div>
      </Card>

      <ModalShell
        open={isModalOpen}
        title="Stock Adjustment"
        description="Update product stock levels and keep movement history accurate."
        onClose={onCloseModal}
      >
        <form className="space-y-4" onSubmit={onSubmit}>
          <Field label="Product">
            <select
              className="admin-input"
              value={stockForm.productId}
              onChange={(event) => onFormChange({ ...stockForm, productId: event.target.value })}
              required
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quantity Change">
            <input
              type="number"
              className="admin-input"
              value={stockForm.quantityChange}
              onChange={(event) => onFormChange({ ...stockForm, quantityChange: event.target.value })}
              required
            />
          </Field>
          <Field label="Remarks">
            <textarea
              className="admin-input min-h-[96px]"
              value={stockForm.remarks}
              onChange={(event) => onFormChange({ ...stockForm, remarks: event.target.value })}
              required
            />
          </Field>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
            >
              Update Stock
            </button>
            <button
              type="button"
              onClick={onCloseModal}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}

function EnquiriesPage({ enquiries, loading, onDelete, onRemarksSave, onStatusChange }) {
  const [draftRemarks, setDraftRemarks] = useState({});

  return (
    <Card title="Enquiry Management" description="Manage product and bulk-order enquiries in one place.">
      <div className="space-y-4">
        {enquiries.map((enquiry) => (
          <div key={enquiry.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="font-semibold text-white">{enquiry.name}</p>
                <p className="text-sm text-slate-400">
                  {enquiry.email} • {enquiry.mobileNumber}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Interested in {enquiry.productInterested} • Quantity {enquiry.quantity}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {enquiry.message || "No message provided."}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  className="admin-input min-w-[200px]"
                  value={enquiry.status}
                  onChange={(event) => onStatusChange(enquiry.id, Number(event.target.value))}
                >
                  {enquiryStatusOptions.map((label, index) => (
                    <option key={label} value={index + 1}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onDelete(enquiry.id)}
                  className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <textarea
                className="admin-input min-h-[110px]"
                value={draftRemarks[enquiry.id] ?? enquiry.adminRemarks ?? ""}
                onChange={(event) =>
                  setDraftRemarks((current) => ({
                    ...current,
                    [enquiry.id]: event.target.value,
                  }))
                }
                placeholder="Add internal remarks"
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => onRemarksSave(enquiry.id, draftRemarks[enquiry.id] ?? enquiry.adminRemarks ?? "")}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
              >
                Save Remarks
              </button>
            </div>
          </div>
        ))}
        {!enquiries.length ? <p className="text-sm text-slate-400">No enquiries available.</p> : null}
      </div>
    </Card>
  );
}

function SettingsPage({ loading, settings, onChange, onSubmit }) {
  return (
    <Card title="Settings" description="Keep admin-side operational preferences in one clean workspace.">
      <form className="grid gap-4 lg:grid-cols-2" onSubmit={onSubmit}>
        <Field label="Business Name">
          <input
            className="admin-input"
            value={settings.businessName}
            onChange={(event) => onChange({ ...settings, businessName: event.target.value })}
          />
        </Field>
        <Field label="Support Email">
          <input
            type="email"
            className="admin-input"
            value={settings.supportEmail}
            onChange={(event) => onChange({ ...settings, supportEmail: event.target.value })}
          />
        </Field>
        <Field label="Support Phone">
          <input
            className="admin-input"
            value={settings.supportPhone}
            onChange={(event) => onChange({ ...settings, supportPhone: event.target.value })}
          />
        </Field>
        <Field label="Frontend URL">
          <input
            className="admin-input"
            value={settings.frontendUrl}
            onChange={(event) => onChange({ ...settings, frontendUrl: event.target.value })}
          />
        </Field>
        <Field label="Currency">
          <input
            className="admin-input"
            value={settings.currency}
            onChange={(event) => onChange({ ...settings, currency: event.target.value })}
          />
        </Field>
        <Field label="Low Stock Threshold">
          <input
            className="admin-input"
            value={settings.lowStockThreshold}
            onChange={(event) =>
              onChange({ ...settings, lowStockThreshold: event.target.value })
            }
          />
        </Field>
        <div className="lg:col-span-2">
          <Checkbox
            label="Enable bulk order admin notifications"
            checked={settings.bulkOrderNotifications}
            onChange={(checked) =>
              onChange({ ...settings, bulkOrderNotifications: checked })
            }
          />
        </div>
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            Save Settings
          </button>
        </div>
      </form>
    </Card>
  );
}

function ModalShell({ children, description, onClose, open, title }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-slate-950/50">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            {description ? <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>
        <div className="max-h-[calc(92vh-110px)] overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function Card({ action, children, description, title }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          {description ? <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

function Field({ children, label }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({ checked, label, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-500 bg-transparent text-emerald-500 focus:ring-emerald-500"
      />
      <span>{label}</span>
    </label>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-lg shadow-slate-950/20">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}

function LoadingPanel({ label }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 text-center text-sm text-slate-400 shadow-2xl backdrop-blur-xl">
      {label}
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[70] max-w-sm rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p
        className={classNames(
          "text-sm font-medium",
          toast.type === "error" ? "text-rose-200" : "text-emerald-200",
        )}
      >
        {toast.message}
      </p>
    </div>
  );
}
