import { defaultBrands, ownBrandName, ownBrandSlug } from "../data/products";
import { apiRequest } from "./api";
import { getFallbackBrands } from "./productService";

function normalizeBrand(brand) {
  return {
    id: brand.id,
    name: brand.name || ownBrandName,
    slug: brand.slug || ownBrandSlug,
    logoUrl: brand.logoUrl || "",
    description: brand.description || "",
    isOwnBrand: Boolean(brand.isOwnBrand),
    isActive: brand.isActive ?? true,
    productCount: Number(brand.productCount || 0),
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  };
}

function findFallbackBrandBySlug(slug) {
  return getFallbackBrands().find((brand) => brand.slug === slug);
}

export async function getBrands() {
  try {
    const data = await apiRequest("/api/brands");
    return (data || []).map(normalizeBrand);
  } catch {
    return getFallbackBrands().map(normalizeBrand);
  }
}

export async function getBrandBySlug(slug) {
  try {
    return normalizeBrand(await apiRequest(`/api/brands/slug/${slug}`));
  } catch (error) {
    const fallback = findFallbackBrandBySlug(slug);
    if (fallback) {
      return normalizeBrand(fallback);
    }
    throw error;
  }
}

export async function createBrand(data) {
  return normalizeBrand(
    await apiRequest("/api/brands", {
      method: "POST",
      body: data,
    }),
  );
}

export async function updateBrand(id, data) {
  return normalizeBrand(
    await apiRequest(`/api/brands/${id}`, {
      method: "PUT",
      body: data,
    }),
  );
}

export async function deleteBrand(id) {
  return apiRequest(`/api/brands/${id}`, {
    method: "DELETE",
  });
}

export function getFallbackBrandCards() {
  return defaultBrands.map(normalizeBrand);
}
