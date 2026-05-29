import { apiRequest } from "./api";
import { getCategories as getMasterCategories } from "./masterApi";

export async function getProducts(query = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiRequest(`/api/products${suffix}`);
}

export async function getProductBySlug(slug) {
  return apiRequest(`/api/products/slug/${slug}`);
}

export async function getProductById(id) {
  return apiRequest(`/api/products/${id}`);
}

export async function getProductsByCategory(categoryId) {
  return apiRequest(`/api/products/category/${categoryId}`);
}

export async function getCategories() {
  return getMasterCategories();
}
