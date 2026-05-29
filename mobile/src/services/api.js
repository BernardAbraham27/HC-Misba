import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from "axios";

export const TOKEN_KEY = "gg-mobile-token";
export const USER_KEY = "gg-mobile-user";
export const ROLE_KEY = "gg-mobile-role";
export const CART_KEY = "gg-mobile-cart";
export const GUEST_KEY = "gg-mobile-guest";
export const GUEST_ORDERS_KEY = "gg-mobile-guest-orders";

const fallbackBaseUrl = "http://localhost:5142";
const expoConfigBaseUrl =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  Constants.manifest2?.extra?.expoClient?.extra?.apiBaseUrl;
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  expoConfigBaseUrl ||
  fallbackBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ""),
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, ROLE_KEY]);
    }
    return Promise.reject(error);
  },
);

export function unwrapResponse(response) {
  return response?.data?.data ?? response?.data;
}

export default api;
