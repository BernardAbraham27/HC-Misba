import { useState } from "react";
import { HeartIcon, StarIcon } from "./IconSet";
import ProductBottle from "./ProductBottle";

const toneClasses = {
  emerald: "bg-emerald-50 text-emerald-700",
  sky: "bg-sky-50 text-sky-700",
  teal: "bg-teal-50 text-teal-700",
  mint: "bg-lime-50 text-lime-700",
  blue: "bg-blue-50 text-blue-700",
  indigo: "bg-indigo-50 text-indigo-700",
  cyan: "bg-cyan-50 text-cyan-700",
  lime: "bg-green-50 text-green-700",
  orange: "bg-orange-50 text-orange-700",
  pink: "bg-pink-50 text-pink-700",
  purple: "bg-purple-50 text-purple-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
};

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const badgeClass = toneClasses[product.tone] ?? toneClasses.emerald;
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <article className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {product.tag}
        </span>
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={`Toggle wishlist for ${product.name}`}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
            isWishlisted
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-500"
          }`}
        >
          <HeartIcon filled={isWishlisted} />
        </button>
      </div>

      <div className="mt-4 flex justify-center rounded-[1.5rem] bg-gradient-to-b from-slate-50 to-white py-5">
        <ProductBottle
          name={product.name}
          badge={product.category}
          tone={product.tone}
          size="card"
          alt={product.alt}
        />
      </div>

      <p className="mt-4 text-sm font-medium text-emerald-700">{product.category}</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-900">{product.name}</h3>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1 text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} filled className="h-4 w-4" />
          ))}
        </div>
        <span className="text-sm text-slate-500">{product.rating}</span>
      </div>

      <div className="mt-4 flex items-end gap-3">
        <p className="text-2xl font-semibold text-slate-900">Rs. {product.price}</p>
        <p className="text-sm text-slate-400 line-through">Rs. {product.originalPrice}</p>
        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
          {discount}% off
        </span>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-600">Size options</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                selectedSize === size
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAddToCart(product.name, selectedSize)}
        className="mt-5 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Add to Cart
      </button>
    </article>
  );
}
