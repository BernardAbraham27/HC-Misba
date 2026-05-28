import { useEffect, useMemo, useState } from "react";
import StoreShell from "./StoreShell";
import { clearCart, getCart, removeCartItem, updateCartItem } from "../services/cartService";

export default function CartPage({ onNavigate, setToast }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cartCount = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    [cart],
  );

  useEffect(() => {
    document.title = "Cart | God Grace Home Products";
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      setCart(await getCart());
    } catch (requestError) {
      setError(requestError.message || "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantity = async (item, nextQuantity) => {
    if (nextQuantity < 1) return;
    try {
      const updated = await updateCartItem({
        cartItemId: item.cartItemId,
        quantity: nextQuantity,
      });
      setCart(updated);
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message || "Could not update cart." });
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      const updated = await removeCartItem(cartItemId);
      setCart(updated);
      setToast({ type: "success", message: "Item removed from cart." });
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message || "Could not remove item." });
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setCart({ items: [], subtotal: 0, discount: 0, deliveryCharge: 0, grandTotal: 0 });
      setToast({ type: "success", message: "Cart cleared." });
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message || "Could not clear cart." });
    }
  };

  return (
    <StoreShell onNavigate={onNavigate}>
      <section className="section-shell py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-kicker">Shopping Cart</span>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">Your Cart</h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Review product sizes, quantities, and order totals before checkout.
            </p>
          </div>
          {cart?.items?.length ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              Clear Cart
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading cart...
          </div>
        ) : error ? (
          <div className="mt-10 rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-center text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        ) : !cart?.items?.length ? (
          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">No products in your cart</h2>
            <p className="mt-3 text-sm text-slate-600">Add products to continue with checkout.</p>
            <button
              type="button"
              onClick={() => onNavigate("/products")}
              className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              {cart.items.map((item) => (
                <div key={item.cartItemId} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-28 w-28 items-center justify-center rounded-[1.5rem] bg-slate-50 p-4">
                        {item.productImageUrl ? (
                          <img
                            src={item.productImageUrl}
                            alt={`${item.productName} product image`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="h-full w-full rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{item.productName}</h2>
                        <p className="mt-1 text-sm text-slate-500">Selected size: {item.size}</p>
                        <p className="mt-2 text-sm font-semibold text-slate-700">Rs. {item.unitPrice} each</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center rounded-full border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => handleQuantity(item, item.quantity - 1)}
                          className="px-4 py-3 text-lg font-semibold text-slate-700"
                        >
                          -
                        </button>
                        <span className="min-w-10 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantity(item, item.quantity + 1)}
                          className="px-4 py-3 text-lg font-semibold text-slate-700"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Subtotal</p>
                        <p className="text-lg font-semibold text-slate-900">Rs. {item.totalPrice}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.cartItemId)}
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Cart Summary</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">Rs. {cart.subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="font-semibold text-slate-900">Rs. {cart.discount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-slate-900">Rs. {cart.deliveryCharge}</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-slate-900">Grand Total</span>
                    <span className="text-xl font-semibold text-slate-900">Rs. {cart.grandTotal}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("/checkout")}
                className="mt-8 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Proceed to Checkout
              </button>
              <p className="mt-4 text-sm text-slate-500">{cartCount} item(s) currently in your cart.</p>
            </div>
          </div>
        )}
      </section>
    </StoreShell>
  );
}
