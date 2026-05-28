import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { CART_KEY } from "../services/api";
import {
  addCartItem as addRemoteCartItem,
  clearCart as clearRemoteCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "../services/cartService";
import { getProductById } from "../data/products";

const CartContext = createContext(null);

function normalizeLocalItem(item) {
  const product = item.product || getProductById(Number(item.productId));
  if (!product) {
    return null;
  }

  return {
    cartItemId: item.cartItemId || null,
    productId: product.id,
    productName: product.name,
    size: item.size || product.sizes?.[0] || product.size,
    quantity: Number(item.quantity || 1),
    unitPrice: Number(item.unitPrice || product.price),
    totalPrice: Number(item.quantity || 1) * Number(item.unitPrice || product.price),
    imageUrl: item.imageUrl || "",
    product,
  };
}

function normalizeRemoteItem(item) {
  const product = getProductById(Number(item.productId));
  return normalizeLocalItem({
    cartItemId: item.cartItemId,
    productId: item.productId,
    size: item.size,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    imageUrl: item.imageUrl,
    product,
  });
}

async function readLocalCart() {
  try {
    const raw = await AsyncStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeLocalItem).filter(Boolean) : [];
  } catch {
    return [];
  }
}

async function writeLocalCart(items) {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { isAuthenticated, isCustomer, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      loadCart();
    }
  }, [authLoading, isAuthenticated, isCustomer]);

  async function syncLocalState(nextItems) {
    setItems(nextItems);
    await writeLocalCart(nextItems);
  }

  async function loadCart() {
    setIsLoading(true);

    try {
      if (isAuthenticated && isCustomer) {
        const response = await getCart();
        const remoteItems = (response?.items || []).map(normalizeRemoteItem).filter(Boolean);
        setItems(remoteItems);
      } else {
        setItems(await readLocalCart());
      }
    } catch {
      setItems(await readLocalCart());
    } finally {
      setIsLoading(false);
    }
  }

  async function addToCart(product, selectedSize = product.sizes?.[0] || product.size, quantity = 1) {
    if (isAuthenticated && isCustomer) {
      await addRemoteCartItem({
        productId: product.id,
        size: selectedSize,
        quantity,
      });
      await loadCart();
      return;
    }

    const current = await readLocalCart();
    const index = current.findIndex(
      (item) => item.productId === product.id && item.size === selectedSize,
    );

    if (index >= 0) {
      const next = [...current];
      next[index] = {
        ...next[index],
        quantity: next[index].quantity + quantity,
        totalPrice: (next[index].quantity + quantity) * next[index].unitPrice,
      };
      await syncLocalState(next);
      return;
    }

    await syncLocalState([
      ...current,
      normalizeLocalItem({
        productId: product.id,
        size: selectedSize,
        quantity,
        unitPrice: product.price,
        product,
      }),
    ]);
  }

  async function updateQuantity(productId, size, quantity, cartItemId) {
    if (quantity <= 0) {
      await removeItem(productId, size, cartItemId);
      return;
    }

    if (isAuthenticated && isCustomer && cartItemId) {
      await updateCartItem({ cartItemId, quantity });
      await loadCart();
      return;
    }

    const current = await readLocalCart();
    const next = current.map((item) =>
      item.productId === productId && item.size === size
        ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
        : item,
    );
    await syncLocalState(next);
  }

  async function removeItem(productId, size, cartItemId) {
    if (isAuthenticated && isCustomer && cartItemId) {
      await deleteCartItem(cartItemId);
      await loadCart();
      return;
    }

    const current = await readLocalCart();
    const next = current.filter((item) => !(item.productId === productId && item.size === size));
    await syncLocalState(next);
  }

  async function clearCart() {
    if (isAuthenticated && isCustomer) {
      await clearRemoteCart();
      await loadCart();
      return;
    }

    await syncLocalState([]);
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const originalTotal = items.reduce((sum, item) => {
      const mrp = Number(item.product?.mrp || item.unitPrice);
      return sum + mrp * item.quantity;
    }, 0);
    const deliveryCharge = subtotal >= 500 || subtotal === 0 ? 0 : 40;
    const savings = Math.max(originalTotal - subtotal, 0);

    return {
      subtotal,
      deliveryCharge,
      savings,
      grandTotal: subtotal + deliveryCharge,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      reloadCart: loadCart,
      ...totals,
    }),
    [isLoading, items, totals],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
