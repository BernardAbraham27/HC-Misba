import StoreProductCard from "./StoreProductCard";

export default function FeaturedProducts({
  products,
  searchTerm,
  activeBrandLabel,
  activeCategoryName,
  activeNeedTitle,
  onClearFilters,
  onAddToCart,
  onBuyNow,
}) {
  return (
    <section id="best-sellers" className="section-shell py-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="section-kicker">Best Sellers</span>
          <h2 className="section-title">Best Selling Home Care Products</h2>
          <p className="section-copy">
            Discover bestselling cleaning essentials across own-brand and partner-brand selections.
          </p>
        </div>

        {searchTerm || activeBrandLabel || activeCategoryName || activeNeedTitle ? (
          <div className="flex flex-wrap items-center gap-2">
            {activeBrandLabel ? (
              <span className="rounded-full bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white">
                Brand: {activeBrandLabel}
              </span>
            ) : null}
            {activeCategoryName ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                Category: {activeCategoryName}
              </span>
            ) : null}
            {activeNeedTitle ? (
              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
                Need: {activeNeedTitle}
              </span>
            ) : null}
            {searchTerm ? (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
                Search: {searchTerm}
              </span>
            ) : null}
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Clear Filters
            </button>
          </div>
        ) : null}
      </div>

      {products.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <StoreProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h3 className="text-2xl font-semibold text-slate-900">No matching products found</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Try another brand or clear the active filters to view bestselling products.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-5 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Show All Products
          </button>
        </div>
      )}
    </section>
  );
}
