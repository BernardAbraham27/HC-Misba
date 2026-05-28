import { useEffect, useState } from "react";
import CustomerLayout from "../layouts/CustomerLayout";
import OrderStatusTimeline from "./OrderStatusTimeline";
import { cancelOrder, getOrderById } from "../services/orderService";

function paymentLabel(value) {
  return { 1: "Cash on Delivery", 2: "UPI", 3: "Razorpay" }[value] || "Unknown";
}

function paymentStatusLabel(value) {
  return { 1: "Pending", 2: "Paid", 3: "Failed", 4: "Refunded" }[value] || "Unknown";
}

export default function OrderDetailsPage({ id, onNavigate, setToast }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Order Details | God Grace Home Products";
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      setOrder(await getOrderById(id));
    } catch (requestError) {
      setError(requestError.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder(id);
      setToast({ type: "success", message: "Order cancelled successfully." });
      await loadOrder();
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message || "Could not cancel order." });
    }
  };

  return (
    <CustomerLayout title="Order Details" onNavigate={onNavigate}>
      <section className="section-shell py-12">
        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading order details...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-center text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        ) : order ? (
          <>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <span className="section-kicker">Order Details</span>
                  <h1 className="mt-4 text-4xl font-semibold text-slate-900">{order.orderNumber}</h1>
                  <p className="mt-3 text-sm text-slate-600">
                    Order placed on {new Date(order.orderDate || order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {order.status === 1 || order.status === 2 ? (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                      Cancel Order
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setToast({ type: "success", message: "Invoice download placeholder." })}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <OrderStatusTimeline status={order.status} />
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-slate-900">Ordered Items</h2>
                  <div className="mt-6 space-y-4">
                    {order.items.map((item) => (
                      <div key={`${item.productId}-${item.size}`} className="flex flex-col gap-4 rounded-[1.5rem] bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-24 w-24 items-center justify-center rounded-[1.4rem] bg-white p-3">
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
                            <h3 className="text-lg font-semibold text-slate-900">{item.productName}</h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {item.size} • Qty {item.quantity}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">Unit price: Rs. {item.unitPrice}</p>
                          </div>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">Rs. {item.totalPrice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-slate-900">Delivery Address</h2>
                  <div className="mt-5 text-sm leading-7 text-slate-600">
                    <p className="font-semibold text-slate-900">{order.address?.fullName}</p>
                    <p>{order.address?.mobileNumber}</p>
                    <p>{order.address?.addressLine1}</p>
                    {order.address?.addressLine2 ? <p>{order.address.addressLine2}</p> : null}
                    <p>
                      {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                    </p>
                    {order.address?.landmark ? <p>Landmark: {order.address.landmark}</p> : null}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-slate-900">Bill Summary</h2>
                  <div className="mt-5 space-y-4 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Payment Method</span>
                      <span className="font-semibold text-slate-900">{paymentLabel(order.paymentMethod)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Status</span>
                      <span className="font-semibold text-slate-900">{paymentStatusLabel(order.paymentStatus)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">Rs. {order.subtotal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Discount</span>
                      <span className="font-semibold text-slate-900">Rs. {order.discountAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Delivery Charge</span>
                      <span className="font-semibold text-slate-900">Rs. {order.deliveryCharge}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                      <span className="text-base font-semibold text-slate-900">Grand Total</span>
                      <span className="text-xl font-semibold text-slate-900">Rs. {order.grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </CustomerLayout>
  );
}
