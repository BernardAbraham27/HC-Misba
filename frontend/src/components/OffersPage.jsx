import StoreShell from "./StoreShell";
import { allProducts } from "../data/products";

export default function OffersPage({ onNavigate }) {
  const ownBrandProducts = allProducts.filter((product) => product.brandType === "Own Brand").slice(0, 4);
  const partnerProducts = allProducts.filter((product) => product.brandType !== "Own Brand").slice(0, 3);

  return (
    <StoreShell onNavigate={onNavigate}>
      <section className="section-shell py-12">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#155BD5_0%,#2a75ee_100%)] p-8 text-white shadow-[0_22px_60px_rgba(21,91,213,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">Offers</p>
          <h1 className="mt-4 text-4xl font-semibold">Buy 2 MISPA favourites and save more</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-100 sm:text-base">
            Shop current God Grace promotions across own-brand and partner-brand product lines with real transparent PNG product cards.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">Own Brand Highlights</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {ownBrandProducts.map((product) => (
              <article key={product.id} className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-48 items-center justify-center rounded-[1.3rem] bg-[#EEF6FF] p-4">
                  <img src={product.imageUrl} alt={product.alt} className="h-full w-full object-contain" />
                </div>
                <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.badgeClass}`}>
                  {product.brandType}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-500">Rs. {product.price}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">Partner Brand Offers</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {partnerProducts.map((product) => (
              <article key={product.id} className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-48 items-center justify-center rounded-[1.3rem] bg-[#EEF6FF] p-4">
                  <img src={product.imageUrl} alt={product.alt} className="h-full w-full object-contain" />
                </div>
                <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.badgeClass}`}>
                  {product.brandType}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-500">Rs. {product.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
