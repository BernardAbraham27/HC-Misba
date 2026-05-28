import { useState } from "react";
import StoreShell from "./StoreShell";
import OrderStatusTimeline from "./OrderStatusTimeline";
import { trackOrder } from "../services/orderService";

function paymentLabel(value) {
  return { 1: "Cash on Delivery", 2: "UPI", 3: "Razorpay" }[value] || "Unknown";
}

function paymentStatusLabel(value) {
  return { 1: "Pending", 2: "Paid", 3: "Failed", 4: "Refunded" }[value] || "Unknown";
}

export default function TrackOrderPage({ onNavigate, setToast }) {
  const [form, setForm] = useState({ orderNumber: "", mobileNumber: "" });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const result = await trackOrder(form.orderNumber.trim(), form.mobileNumber.trim());
      setOrder(result);
    } catch (requestError) {
      const message = requestError.message || "Could not find the order.";
      setError(message);
      setOrder(null);
      setToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoreShell onNavigate={onNavigate}>
      <section className="section-shell py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <span className="section-kicker">Track Order</span>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">Track Your Order</h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Enter your order number and mobile number to view delivery progress.
            </p>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Order Number</span>
                <input
                  value={form.orderNumber}
                  onChange={(event) => setForm((current) => ({ ...current, orderNumber: event.target.value }))}
                  className="customer-input"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</span>
                <input
                  value={form.mobileNumber}
                  onChange={(event) => setForm((current) => ({ ...current, mobileNumber: event.target.value }))}
                  className="customer-input"
                  required
                />
              </label>
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? "Tracking..." : "Track Order"}
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {order ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {order.orderNumber}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">{order.customerName}</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Ordered on {new Date(order.orderDate || order.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                    {paymentStatusLabel(order.paymentStatus)}
                  </span>
                </div>

                <div className="mt-6">
                  <OrderStatusTimeline status={order.status} />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Payment Method</p>
                    <p className="mt-2 font-semibold text-slate-900">{paymentLabel(order.paymentMethod)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Amount</p>
                    <p className="mt-2 font-semibold text-slate-900">Rs. {order.grandTotal}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Delivery Address</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {order.address?.fullName}<br />
                    {order.address?.addressLine1}
                    {order.address?.addressLine2 ? `, ${order.address.addressLine2}` : ""}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                    {order.address?.landmark ? `, ${order.address.landmark}` : ""}
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {order.items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{item.productName}</p>
                        <p className="text-sm text-slate-500">{item.size} • Qty {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-900">Rs. {item.totalPrice}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Order updates in one place</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Track your guest order anytime using the order number and mobile number used during checkout.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
