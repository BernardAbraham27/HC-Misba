import StoreProductCard from "./StoreProductCard";

export default function BrandProductSection({
  id,
  kicker,
  title,
  subtitle,
  products,
  emptyMessage,
  onAddToCart,
  onBuyNow,
}) {
  return (
    <section id={id} className="section-shell py-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="section-kicker">{kicker}</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">{subtitle}</p>
        </div>
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
          <p className="text-sm font-medium text-slate-600">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}
