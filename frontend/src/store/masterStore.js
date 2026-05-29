import { useSyncExternalStore } from "react";
import * as masterApi from "../services/masterApi";

const STORAGE_KEY = "gg-master-cache";

let state = {
  brands: [],
  brandTypes: [],
  categories: [],
  productSizes: [],
  productStatuses: [],
  orderStatuses: [],
  paymentStatuses: [],
  customerStatuses: [],
  couponStatuses: [],
  inventoryStatuses: [],
  enquiryStatuses: [],
  roles: [],
  isLoading: false,
  error: "",
};

const listeners = new Set();
let inFlight = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(patch) {
  state = { ...state, ...patch };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore cache write failures.
  }
  emit();
}

function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    state = { ...state, ...JSON.parse(raw), isLoading: false, error: "" };
  } catch {
    // Ignore cache parse failures.
  }
}

readCache();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return state;
}

export function useMasterStore(selector = (snapshot) => snapshot) {
  return selector(useSyncExternalStore(subscribe, getSnapshot, getSnapshot));
}

export async function loadAllMasters(force = false) {
  if (inFlight && !force) {
    return inFlight;
  }

  setState({ isLoading: true, error: "" });
  inFlight = Promise.all([
    masterApi.getBrands(),
    masterApi.getBrandTypes(),
    masterApi.getCategories(),
    masterApi.getProductSizes(),
    masterApi.getProductStatuses(),
    masterApi.getOrderStatuses(),
    masterApi.getPaymentStatuses(),
    masterApi.getCustomerStatuses(),
    masterApi.getCouponStatuses(),
    masterApi.getInventoryStatuses(),
    masterApi.getEnquiryStatuses(),
    masterApi.getRoles(),
  ])
    .then(
      ([
        brands,
        brandTypes,
        categories,
        productSizes,
        productStatuses,
        orderStatuses,
        paymentStatuses,
        customerStatuses,
        couponStatuses,
        inventoryStatuses,
        enquiryStatuses,
        roles,
      ]) => {
        setState({
          brands: brands || [],
          brandTypes: brandTypes || [],
          categories: categories || [],
          productSizes: productSizes || [],
          productStatuses: productStatuses || [],
          orderStatuses: orderStatuses || [],
          paymentStatuses: paymentStatuses || [],
          customerStatuses: customerStatuses || [],
          couponStatuses: couponStatuses || [],
          inventoryStatuses: inventoryStatuses || [],
          enquiryStatuses: enquiryStatuses || [],
          roles: roles || [],
          isLoading: false,
          error: "",
        });
        return getSnapshot();
      },
    )
    .catch((error) => {
      setState({
        isLoading: false,
        error: error.message || "Failed to load master data.",
      });
      throw error;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export const refreshMasters = () => loadAllMasters(true);

export function clearMasters() {
  state = {
    brands: [],
    brandTypes: [],
    categories: [],
    productSizes: [],
    productStatuses: [],
    orderStatuses: [],
    paymentStatuses: [],
    customerStatuses: [],
    couponStatuses: [],
    inventoryStatuses: [],
    enquiryStatuses: [],
    roles: [],
    isLoading: false,
    error: "",
  };
  localStorage.removeItem(STORAGE_KEY);
  emit();
}
