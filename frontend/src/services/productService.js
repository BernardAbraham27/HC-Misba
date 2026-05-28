import { shopCategories } from "../data/categories";
import {
  allProducts,
  defaultBrands,
  featuredProducts,
  ownBrandName,
  ownBrandSlug,
  toStorefrontProduct,
} from "../data/products";
import { apiRequest } from "./api";

function mapCategory(category) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    imageUrl: "",
    isActive: true,
  };
}

function mapProduct(product) {
  const category = shopCategories.find((item) => item.name === product.category);
  const storefront = toStorefrontProduct(product);

  return {
    id: storefront.id,
    name: storefront.name,
    slug: storefront.slug,
    brandId: storefront.brandId ?? 1,
    brandName: storefront.brandName || ownBrandName,
    brandSlug: storefront.brandSlug || ownBrandSlug,
    isOwnBrand: storefront.isOwnBrand ?? true,
    categoryId: category?.id ?? 0,
    categoryName: storefront.category,
    shortDescription: storefront.shortDescription,
    description: storefront.description,
    price: storefront.originalPrice,
    discountPrice: storefront.price,
    stockQuantity: storefront.stockQuantity,
    imageUrl: storefront.imageUrl || storefront.image || "",
    rating: storefront.rating,
    tone: storefront.tone,
    isBestSeller: storefront.isBestSeller || featuredProducts.some((item) => item.id === storefront.id),
    isNewArrival: storefront.isNewArrival || storefront.tag === "New Arrival",
    isActive: true,
    sizes: storefront.sizes,
    benefits: storefront.benefits,
    howToUse: storefront.howToUse,
    safetyInstructions: storefront.safetyInstructions,
  };
}

const localCatalog = allProducts.map(mapProduct);

function sortProducts(products, sortBy) {
  const list = [...products];

  if (sortBy === "price-low-to-high") {
    return list.sort(
      (a, b) => Number(a.discountPrice ?? a.price) - Number(b.discountPrice ?? b.price),
    );
  }

  if (sortBy === "price-high-to-low") {
    return list.sort(
      (a, b) => Number(b.discountPrice ?? b.price) - Number(a.discountPrice ?? a.price),
    );
  }

  return list;
}

function getLocalProducts(query = {}) {
  const normalizedSearch = String(query.search || "").trim().toLowerCase();
  const categoryId = query.categoryId ? Number(query.categoryId) : null;
  const brandId = query.brandId ? Number(query.brandId) : null;
  const brandSlug = String(query.brandSlug || "").trim().toLowerCase();
  const isOwnBrand =
    query.isOwnBrand === true || query.isOwnBrand === "true"
      ? true
      : query.isOwnBrand === false || query.isOwnBrand === "false"
        ? false
        : null;
  const filtered = localCatalog.filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.categoryName.toLowerCase().includes(normalizedSearch) ||
      product.brandName.toLowerCase().includes(normalizedSearch) ||
      product.shortDescription.toLowerCase().includes(normalizedSearch);
    const matchesCategory = !categoryId || product.categoryId === categoryId;
    const matchesBrandId = !brandId || product.brandId === brandId;
    const matchesBrandSlug = !brandSlug || product.brandSlug.toLowerCase() === brandSlug;
    const matchesOwnBrand =
      isOwnBrand === null ? true : product.isOwnBrand === isOwnBrand;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrandId &&
      matchesBrandSlug &&
      matchesOwnBrand
    );
  });

  const sorted = sortProducts(filtered, query.sortBy);
  const pageSize = Number(query.pageSize || sorted.length);

  return {
    items: sorted.slice(0, pageSize),
    totalCount: sorted.length,
    pageNumber: 1,
    pageSize,
  };
}

function fallbackProductBySlug(slug) {
  const product = localCatalog.find((item) => item.slug === slug);
  if (!product) {
    throw new Error("Product not found.");
  }
  return product;
}

export async function getProducts(query = {}) {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value);
      }
    });

    const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return await apiRequest(`/api/products${suffix}`);
  } catch {
    return getLocalProducts(query);
  }
}

export async function getProductBySlug(slug) {
  try {
    return await apiRequest(`/api/products/slug/${slug}`);
  } catch {
    return fallbackProductBySlug(slug);
  }
}

export async function getProductById(id) {
  try {
    return await apiRequest(`/api/products/${id}`);
  } catch {
    const product = localCatalog.find((item) => item.id === Number(id));
    if (!product) {
      throw new Error("Product not found.");
    }
    return product;
  }
}

export async function getProductsByCategory(categoryId) {
  try {
    return await apiRequest(`/api/products/category/${categoryId}`);
  } catch {
    return localCatalog.filter((item) => item.categoryId === Number(categoryId));
  }
}

export async function getCategories() {
  try {
    return await apiRequest("/api/categories");
  } catch {
    return shopCategories.map(mapCategory);
  }
}

export function getFallbackBrands() {
  return defaultBrands.map((brand) => ({
    ...brand,
    productCount: localCatalog.filter((product) => product.brandId === brand.id).length,
  }));
}
