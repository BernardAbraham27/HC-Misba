import { useEffect, useState } from "react";
import CustomerLayout from "../layouts/CustomerLayout";
import { cancelOrder, getMyOrders } from "../services/orderService";
import OrderStatusTimeline from "./OrderStatusTimeline";

function paymentLabel(value) {
  return { 1: "Cash on Delivery", 2: "UPI", 3: "Razorpay" }[value] || "Unknown";
}

function paymentStatusLabel(value) {
  return { 1: "Pending", 2: "Paid", 3: "Failed", 4: "Refunded" }[value] || "Unknown";
}

function orderStatusLabel(value) {
  return {
    1: "Pending",
    2: "Confirmed",
    3: "Packed",
    4: "Shipped",
    5: "Out For Delivery",
    6: "Delivered",
    7: "Cancelled",
    8: "Returned",
  }[value] || "Unknown";
}

export default function MyOrdersPage({ onNavigate, setToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "My Orders | God Grace Home Products";
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      setOrders(await getMyOrders());
    } catch (requestError) {
      setError(requestError.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id);
      setToast({ type: "success", message: "Order cancelled successfully." });
      await loadOrders();
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message || "Could not cancel order." });
    }
  };

  return (
    <CustomerLayout title="My Orders" onNavigate={onNavigate}>
      <section className="section-shell py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <span className="section-kicker">My Orders</span>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Track Your Orders</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            View order status, payment state, and item details for all placed orders.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading orders...
          </div>
        ) : error ? (
          <div className="mt-10 rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-center text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">No orders yet</h2>
            <p className="mt-3 text-sm text-slate-600">Start shopping to place your first order.</p>
            <button
              type="button"
              onClick={() => onNavigate("/products")}
              className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {orders.map((order) => {
              const canCancel = order.status === 1 || order.status === 2;
              return (
                <article key={order.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        {order.orderNumber}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                        {order.items.length} product{order.items.length === 1 ? "" : "s"} • Rs. {order.grandTotal}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Order date: {new Date(order.orderDate || order.createdAt).toLocaleString("en-IN")}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                        <span className="rounded-full bg-slate-100 px-3 py-1.5">{paymentLabel(order.paymentMethod)}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1.5">{paymentStatusLabel(order.paymentStatus)}</span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">{orderStatusLabel(order.status)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/orders/${order.id}`)}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                      >
                        View Details
                      </button>
                      {canCancel ? (
                        <button
                          type="button"
                          onClick={() => handleCancel(order.id)}
                          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                        >
                          Cancel Order
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-6">
                    <OrderStatusTimeline status={order.status} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </CustomerLayout>
  );
}
