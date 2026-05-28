import api, { unwrapResponse } from "./api";
import { categories } from "../data/categories";
import { products } from "../data/products";

function normalizeProduct(product) {
  const localMatch =
    products.find((item) => item.id === Number(product.id)) ||
    products.find((item) => item.slug === product.slug) ||
    products.find((item) => item.name === product.name);

  return {
    ...product,
    imageUrl: product.imageUrl || "",
    imageKey: product.imageKey || localMatch?.imageKey || "productGroupBanner",
    brandName: product.brandName || "God Grace Home Products",
    categoryName: product.categoryName || product.category || localMatch?.categoryName || "Home Care",
    discountPrice: Number(product.discountPrice ?? product.price ?? 0),
    price: Number(product.price ?? product.discountPrice ?? 0),
    sizes: product.sizes?.length ? product.sizes : localMatch?.sizes || ["500ml", "1L", "5L"],
    tone: product.tone || localMatch?.tone || "emerald",
    benefits: product.benefits || localMatch?.benefits || [],
    howToUse: product.howToUse || localMatch?.howToUse || "",
    safetyInstructions: product.safetyInstructions || localMatch?.safetyInstructions || "",
  };
}

function filterLocalProducts({ search = "", categoryId = "", brand = "" } = {}) {
  const normalizedSearch = String(search).trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.categoryName.toLowerCase().includes(normalizedSearch) ||
      product.brandName.toLowerCase().includes(normalizedSearch);
    const matchesCategory = !categoryId || String(product.categoryId) === String(categoryId);
    const matchesBrand =
      !brand ||
      (brand === "God Grace Home Products" && product.brandName === "God Grace Home Products") ||
      (brand === "Other Brands" && product.brandName !== "God Grace Home Products");

    return matchesSearch && matchesCategory && matchesBrand;
  });
}

export async function getProducts(filters = {}) {
  try {
    const response = await api.get("/api/products", { params: filters });
    const data = unwrapResponse(response);
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    return {
      items: items.map(normalizeProduct),
      totalCount: data?.totalCount ?? items.length,
    };
  } catch {
    const localItems = filterLocalProducts(filters).map(normalizeProduct);
    return {
      items: localItems,
      totalCount: localItems.length,
    };
  }
}

export async function getProductById(id) {
  try {
    const response = await api.get(`/api/products/${id}`);
    return normalizeProduct(unwrapResponse(response));
  } catch {
    const local = products.find((product) => product.id === Number(id));
    if (!local) {
      throw new Error("Product not found.");
    }
    return normalizeProduct(local);
  }
}

export async function getProductBySlug(slug) {
  try {
    const response = await api.get(`/api/products/slug/${slug}`);
    return normalizeProduct(unwrapResponse(response));
  } catch {
    const local = products.find((product) => product.slug === slug);
    if (!local) {
      throw new Error("Product not found.");
    }
    return normalizeProduct(local);
  }
}

export async function getCategories() {
  try {
    const response = await api.get("/api/categories");
    return unwrapResponse(response);
  } catch {
    return categories;
  }
}
