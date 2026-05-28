import { useEffect, useMemo, useState } from "react";
import StoreShell from "./StoreShell";
import { clearCart, getCart, syncGuestCartToCustomerCart } from "../services/cartService";
import { createGuestOrder, createOrder } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

const initialAddressForm = {
  customerName: "",
  mobileNumber: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
};

const paymentMethods = [
  { value: 1, label: "Cash on Delivery", helper: "Place order now and pay at delivery." },
  { value: 2, label: "UPI", helper: "Placeholder payment flow for future integration." },
];

export default function CheckoutPage({ onNavigate, setToast }) {
  const { isAuthenticated, isCustomer, user } = useAuth();
  const [cart, setCart] = useState(null);
  const [addressForm, setAddressForm] = useState(initialAddressForm);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const cartCount = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    [cart],
  );

  useEffect(() => {
    document.title = "Checkout | God Grace Home Products";
    loadCheckoutData();
  }, []);

  useEffect(() => {
    if (!user) return;
    setAddressForm((current) => ({
      ...current,
      customerName: current.customerName || user.fullName || "",
      mobileNumber: current.mobileNumber || user.mobileNumber || "",
      email: current.email || user.email || "",
    }));
  }, [user]);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      setError("");
      const cartData = await getCart();
      if (!cartData.items?.length) {
        onNavigate("/cart", { replace: true });
        return;
      }
      setCart(cartData);
    } catch (requestError) {
      setError(requestError.message || "Failed to load checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);
      setError("");
      const required = ["customerName", "mobileNumber", "addressLine1", "city", "state", "pincode"];
      const missing = required.find((key) => !String(addressForm[key] || "").trim());
      if (missing) throw new Error("Please complete all required delivery details.");

      const guestPayload = {
        customerName: addressForm.customerName.trim(),
        mobileNumber: addressForm.mobileNumber.trim(),
        email: addressForm.email.trim() || undefined,
        addressLine1: addressForm.addressLine1.trim(),
        addressLine2: addressForm.addressLine2.trim(),
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        pincode: addressForm.pincode.trim(),
        landmark: addressForm.landmark.trim(),
        paymentMethod,
        items: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };

      let result;
      if (isAuthenticated && isCustomer) {
        await syncGuestCartToCustomerCart();
        await createOrder({
          fullName: addressForm.customerName.trim(),
          mobileNumber: addressForm.mobileNumber.trim(),
          addressLine1: addressForm.addressLine1.trim(),
          addressLine2: addressForm.addressLine2.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          pincode: addressForm.pincode.trim(),
          landmark: addressForm.landmark.trim(),
          paymentMethod,
        });
        result = { orderNumber: "Saved in your customer order history" };
      } else {
        result = await createGuestOrder(guestPayload);
      }

      await clearCart();
      setToast({ type: "success", message: "Order placed successfully." });
      if (isAuthenticated && isCustomer) {
        onNavigate("/my-orders", { replace: true });
      } else {
        onNavigate(`/order-success/${result.orderNumber}`, { replace: true });
      }
    } catch (requestError) {
      setError(requestError.message || "Could not place order.");
      setToast({ type: "error", message: requestError.message || "Could not place order." });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <StoreShell onNavigate={onNavigate}>
      <section className="section-shell py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <span className="section-kicker">Checkout</span>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Complete Your Order</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Confirm delivery details, choose a payment method, and place your order.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading checkout...
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Delivery Details</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {Object.entries({
                    customerName: "Customer Name",
                    mobileNumber: "Mobile Number",
                    email: "Email (optional)",
                    addressLine1: "Address Line 1",
                    addressLine2: "Address Line 2",
                    city: "City",
                    state: "State",
                    pincode: "Pincode",
                    landmark: "Landmark",
                  }).map(([key, label]) => (
                    <label key={key} className={key === "addressLine1" || key === "addressLine2" ? "sm:col-span-2" : ""}>
                      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                      <input
                        value={addressForm[key]}
                        onChange={(event) =>
                          setAddressForm((current) => ({ ...current, [key]: event.target.value }))
                        }
                        className="customer-input"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Payment Method</h2>
                <div className="mt-6 grid gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`rounded-[1.5rem] border p-4 ${
                        paymentMethod === method.value
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)}
                        className="sr-only"
                      />
                      <p className="font-semibold text-slate-900">{method.label}</p>
                      <p className="mt-2 text-sm text-slate-600">{method.helper}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Order Summary</h2>
              <div className="mt-6 space-y-4">
                {cart?.items?.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{item.productName}</p>
                      <p className="text-sm text-slate-500">
                        {item.size} • Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">Rs. {item.totalPrice}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-slate-200 pt-6 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">Rs. {cart?.subtotal || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="font-semibold text-slate-900">Rs. {cart?.discount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-slate-900">Rs. {cart?.deliveryCharge || 0}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-base font-semibold text-slate-900">Grand Total</span>
                  <span className="text-xl font-semibold text-slate-900">Rs. {cart?.grandTotal || 0}</span>
                </div>
              </div>

              {error ? (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                type="button"
                disabled={placing}
                onClick={handlePlaceOrder}
                className="mt-8 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </section>
    </StoreShell>
  );
}
