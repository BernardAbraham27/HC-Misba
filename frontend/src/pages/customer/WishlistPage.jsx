import CustomerLayout from "../../layouts/CustomerLayout";

export default function WishlistPage({ onNavigate }) {
  return (
    <CustomerLayout title="Wishlist" onNavigate={onNavigate}>
      <section className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <span className="section-kicker">Wishlist</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">No saved products yet</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Save products you want to revisit later and build your perfect home care basket.
        </p>
        <button
          type="button"
          onClick={() => onNavigate("/products")}
          className="mt-8 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Browse Products
        </button>
      </section>
    </CustomerLayout>
  );
}
