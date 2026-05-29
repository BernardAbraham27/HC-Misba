import AsyncStorage from "@react-native-async-storage/async-storage";
import * as masterApi from "../services/masterApi";

const STORAGE_KEY = "gg-mobile-master-cache";

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
  listeners.forEach((listener) => listener(state));
}

async function persist() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore cache write failures.
  }
}

function setState(patch) {
  state = { ...state, ...patch };
  emit();
  persist();
}

export async function hydrateMasters() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return state;
    state = { ...state, ...JSON.parse(raw), isLoading: false, error: "" };
    emit();
  } catch {
    // Ignore cache read failures.
  }
  return state;
}

export function getMasterState() {
  return state;
}

export function subscribeMasters(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
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
        return state;
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

export async function clearMasters() {
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
  await AsyncStorage.removeItem(STORAGE_KEY);
  emit();
}
