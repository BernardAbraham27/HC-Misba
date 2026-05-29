import { apiRequest } from "./api";
import { getBrands as getMasterBrands } from "./masterApi";

function normalizeBrand(brand) {
  const brandTypeName = brand.brandTypeName || (brand.isOwnBrand ? "Own Brand" : "Partner Brand");

  return {
    id: brand.id,
    name: brand.name,
    code: brand.code || "",
    slug: brand.slug || "",
    logoUrl: brand.logoUrl || brand.logoPath || "",
    imageUrl: brand.logoUrl || brand.logoPath || "",
    description: brand.description || "",
    brandTypeId: brand.brandTypeId || null,
    brandTypeName,
    isOwnBrand: Boolean(brand.isOwnBrand ?? brandTypeName === "Own Brand"),
    badge: brandTypeName,
    isActive: brand.isActive ?? true,
    productCount: Number(brand.productCount || 0),
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  };
}

export async function getBrands() {
  return (await getMasterBrands()).map(normalizeBrand);
}

export async function getBrandBySlug(slug) {
  return normalizeBrand(await apiRequest(`/api/brands/slug/${slug}`));
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

export function deleteBrand(id) {
  return apiRequest(`/api/brands/${id}`, {
    method: "DELETE",
  });
}
