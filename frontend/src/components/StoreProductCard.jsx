import { useState } from "react";
import { StarIcon } from "./IconSet";

function brandBadgeClasses(brandType, badgeClass) {
  if (badgeClass) return badgeClass;
  if (brandType === "Own Brand") return "bg-[#DDF7EA] text-[#087443]";
  if (brandType === "Third-Party") return "bg-[#EAF2FF] text-[#155BD5]";
  return "bg-[#EEF6FF] text-[#10233F]";
}

export default function StoreProductCard({
  product,
  onAddToCart,
  onBuyNow,
  onViewProduct,
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "500ml");
  const listPrice = Number(product.originalPrice ?? product.price ?? 0);
  const currentPrice = Number(product.price ?? 0);
  const hasDiscount = listPrice > currentPrice;
  const discount = hasDiscount
    ? Math.round(((listPrice - currentPrice) / listPrice) * 100)
    : 0;

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${brandBadgeClasses(
              product.brandType,
              product.badgeClass,
            )}`}
          >
            {product.brandType}
          </span>
          {product.tag ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {product.tag}
            </span>
          ) : null}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            product.stockQuantity > 0
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <div className="mt-5 rounded-[1.75rem] bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4">
        <div className="flex h-56 items-center justify-center rounded-[1.4rem] bg-white">
          <img
            src={product.imageUrl}
            alt={product.alt}
            loading="lazy"
            className="h-48 w-full object-contain"
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-500">{product.brandName}</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-950">{product.name}</h3>
        <p className="mt-2 text-sm font-medium text-emerald-700">{product.category}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon key={index} filled className="h-4 w-4" />
          ))}
        </div>
        <span className="text-sm font-medium text-slate-500">{product.rating}</span>
      </div>

      <div className="mt-4 flex items-end gap-3">
        <p className="text-2xl font-semibold text-slate-950">Rs. {currentPrice}</p>
        {hasDiscount ? (
          <>
            <p className="text-sm text-slate-400 line-through">Rs. {listPrice}</p>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
              {discount}% off
            </span>
          </>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-700">Size</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(product.sizes || ["500ml"]).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                selectedSize === size
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          disabled={product.stockQuantity <= 0}
          onClick={() => onAddToCart(product, selectedSize)}
          className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to Cart
        </button>
        <button
          type="button"
          disabled={product.stockQuantity <= 0}
          onClick={() => onBuyNow(product, selectedSize)}
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy Now
        </button>
        {onViewProduct ? (
          <button
            type="button"
            onClick={() => onViewProduct(product.slug)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            View Product
          </button>
        ) : null}
      </div>
    </article>
  );
}
