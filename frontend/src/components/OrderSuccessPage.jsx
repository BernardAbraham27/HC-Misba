import StoreShell from "./StoreShell";

export default function OrderSuccessPage({ onNavigate, orderNumber }) {
  return (
    <StoreShell onNavigate={onNavigate}>
      <section className="section-shell py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-100 bg-white p-8 text-center shadow-sm sm:p-10">
          <span className="section-kicker">Order Confirmed</span>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">
            Your order has been placed successfully.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Please save your order number for tracking with your mobile number.
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-6 py-5">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
              Order Number
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{orderNumber}</p>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Our support team is available if you need help with delivery updates or product questions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("/products")}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Continue Shopping
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/track-order")}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Track Order
            </button>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
