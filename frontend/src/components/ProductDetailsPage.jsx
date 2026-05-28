import { useEffect, useMemo, useState } from "react";
import StoreShell from "./StoreShell";
import { addToCart, getCart } from "../services/cartService";
import { getProductBySlug, getProductsByCategory } from "../services/productService";
import { allProducts, toStorefrontProduct } from "../data/products";

export default function ProductDetailsPage({ onNavigate, setToast, slug }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("500ml");
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const item = toStorefrontProduct(await getProductBySlug(slug));
        setProduct(item);
        setSelectedSize(item.sizes?.[0] || "500ml");
        setSelectedImage(item.gallery?.[0] || item.imageUrl || "");

        const related = await getProductsByCategory(item.categoryId || 0);
        const relatedItems = (related || [])
          .map((entry) => toStorefrontProduct(entry))
          .filter((entry) => entry && entry.id !== item.id)
          .slice(0, 4);
        setRelatedProducts(relatedItems);
        document.title = `${item.name} | God Grace Home Products`;
      } catch (requestError) {
        setError(requestError.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  useEffect(() => {
    getCart()
      .then((cart) => setCartCount(cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0))
      .catch(() => {});
  }, []);

  const displayProduct = useMemo(
    () => product || toStorefrontProduct(allProducts.find((item) => item.slug === slug) || allProducts[1]),
    [product, slug],
  );

  const handleAdd = async (buyNow = false) => {
    if (!displayProduct) return;

    try {
      const cart = await addToCart({
        productId: displayProduct.id,
        productName: displayProduct.name,
        categoryName: displayProduct.categoryName,
        size: selectedSize,
        quantity,
        unitPrice: displayProduct.price,
        productImageUrl: displayProduct.imageUrl || "",
      });
      setCartCount(cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
      setToast({ type: "success", message: `${displayProduct.name} added to cart.` });
      if (buyNow) {
        onNavigate("/checkout");
      }
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message || "Could not add product to cart." });
    }
  };

  return (
    <StoreShell onNavigate={onNavigate} cartCount={cartCount}>
      <section className="section-shell py-12">
        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading product details...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-center text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        ) : displayProduct ? (
          <>
            <div className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
              <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-50 via-white to-cyan-50 p-8">
                <div className="flex min-h-[420px] items-center justify-center">
                  <img
                    src={selectedImage || displayProduct.imageUrl}
                    alt={displayProduct.alt || `${displayProduct.name} product image`}
                    className="max-h-[380px] w-full object-contain"
                  />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {displayProduct.gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`rounded-2xl border p-2 transition ${
                        (selectedImage || displayProduct.imageUrl) === image
                          ? "border-[#155BD5] bg-[#EEF6FF]"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${displayProduct.name} thumbnail ${index + 1}`}
                        className="h-20 w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${displayProduct.badgeClass}`}>
                    {displayProduct.brandType}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {displayProduct.brandName}
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {displayProduct.categoryName}
                </p>
                <h1 className="mt-3 text-4xl font-semibold text-slate-900">{displayProduct.name}</h1>
                <p className="mt-4 text-base leading-8 text-slate-600">{displayProduct.description}</p>

                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <p className="text-3xl font-semibold text-slate-900">
                    Rs. {displayProduct.price}
                  </p>
                  <div className="text-sm text-amber-600">
                    Rating 4.7
                    <span className="mx-2 text-slate-300">|</span>
                    126 reviews
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-700">Select Size</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {(displayProduct.sizes?.length ? displayProduct.sizes : ["500ml", "1L"]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          selectedSize === size
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <h2 className="text-lg font-semibold text-slate-900">Highlights</h2>
                  <ul className="mt-3 grid gap-3 text-sm leading-7 text-slate-600">
                    {displayProduct.highlights.map((highlight) => (
                      <li key={highlight} className="rounded-2xl bg-white px-4 py-3">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-700">Quantity</p>
                  <div className="mt-3 flex w-fit items-center rounded-full border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="px-4 py-3 text-lg font-semibold text-slate-700"
                    >
                      -
                    </button>
                    <span className="min-w-12 text-center text-sm font-semibold text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) => Math.min(displayProduct.stockQuantity || 1, current + 1))
                      }
                      className="px-4 py-3 text-lg font-semibold text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleAdd(false)}
                    disabled={displayProduct.stockQuantity <= 0}
                    className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdd(true)}
                    disabled={displayProduct.stockQuantity <= 0}
                    className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Benefits</h2>
                <ul className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
                  {displayProduct.benefits.map((benefit) => (
                    <li key={benefit} className="rounded-2xl bg-emerald-50 px-4 py-3">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">How to Use</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{displayProduct.howToUse}</p>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">Safety Instructions</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{displayProduct.safetyInstructions}</p>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Related Products</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(`/products/${item.slug}`)}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-300 hover:bg-white"
                  >
                    <div className="flex h-48 items-center justify-center rounded-[1.2rem] bg-white py-3">
                      <img
                        src={item.imageUrl}
                        alt={item.alt || `${item.name} product image`}
                        className="h-40 w-full object-contain"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">{item.categoryName}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>
    </StoreShell>
  );
}
