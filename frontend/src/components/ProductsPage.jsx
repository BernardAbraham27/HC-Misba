import { useEffect, useMemo, useState } from "react";
import StoreShell from "./StoreShell";
import StoreProductCard from "./StoreProductCard";
import { toStorefrontProduct } from "../data/products";
import { getBrands } from "../services/brandService";
import { addToCart } from "../services/cartService";
import { getCategories, getProducts } from "../services/productService";
import { useMasterStore } from "../store/masterStore";

function FilterChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductsPage({ locationSearch = "", onNavigate, setToast }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [brandTypeFilter, setBrandTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const brandTypeOptions = useMasterStore((snapshot) => snapshot.brandTypes);

  useEffect(() => {
    const params = new URLSearchParams(locationSearch);
    setBrandFilter(params.get("brand") || "all");
  }, [locationSearch]);

  const brandQuery = useMemo(() => {
    if (brandFilter !== "all") {
      return { brandSlug: brandFilter };
    }

    return {};
  }, [brandFilter]);

  const query = useMemo(
    () => ({
      search: searchTerm,
      categoryId,
      sortBy: sortBy === "latest" ? "" : sortBy,
      pageSize: 50,
      ...brandQuery,
    }),
    [brandQuery, categoryId, searchTerm, sortBy],
  );

  const brandTypes = useMemo(
    () => [{ value: "all", label: "All Brands" }].concat(
      brands.map((brand) => ({
        value: brand.slug,
        label: brand.name,
      })),
    ),
    [brands],
  );

  const selectedBrand = useMemo(
    () => brands.find((brand) => brand.slug === brandFilter) || null,
    [brandFilter, brands],
  );

  const visibleProducts = useMemo(
    () =>
      products.filter((product) =>
        brandTypeFilter === "all"
          ? true
          : String(product.brandTypeId) === String(brandTypeFilter),
      ),
    [brandTypeFilter, products],
  );

  useEffect(() => {
    document.title = "Products | God Grace Home Products";
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [productData, categoryData, brandData] = await Promise.all([
          getProducts(query),
          getCategories(),
          getBrands(),
        ]);
        setProducts(productData.items || []);
        setCategories(categoryData || []);
        setBrands((brandData || []).filter((brand) => brand.isActive));
      } catch (requestError) {
        setError(requestError.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query]);

  const handleAddToCart = async (product, selectedSize) => {
    try {
      await addToCart({
        productId: product.id,
        productName: product.name,
        categoryName: product.category || product.categoryName || "Home Care",
        size: selectedSize,
        quantity: 1,
        unitPrice: product.discountPrice ?? product.price,
        productImageUrl: product.imageUrl || "",
      });
      setToast({ type: "success", message: `${product.name} added to cart.` });
    } catch (requestError) {
      setToast({ type: "error", message: requestError.message || "Could not add to cart." });
    }
  };

  const handleBuyNow = async (product, selectedSize) => {
    await handleAddToCart(product, selectedSize);
    onNavigate("/checkout");
  };

  return (
    <StoreShell
      onNavigate={onNavigate}
      searchTerm={searchInput}
      onSearchChange={setSearchInput}
    >
      <section className="section-shell py-12">
        <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <span className="section-kicker">All Products</span>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">
            {selectedBrand ? `${selectedBrand.name} Products` : "Browse Products by Brand"}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            {selectedBrand
              ? `Showing products for ${selectedBrand.name}. You can search within this brand or switch to another brand below.`
              : "Search by product name and filter by category or brand to browse the full God Grace Home Products lineup."}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onBlur={() => setSearchTerm(searchInput.trim())}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  setSearchTerm(searchInput.trim());
                }
              }}
              placeholder="Search products"
              className="customer-input"
            />
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="customer-input"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="customer-input"
            >
              <option value="latest">Latest</option>
              <option value="price-low-to-high">Price Low to High</option>
              <option value="price-high-to-low">Price High to Low</option>
            </select>
            <button
              type="button"
              onClick={() => setSearchTerm(searchInput.trim())}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Search
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {brandTypes.map((brandType) => (
              <FilterChip
                key={brandType.value}
                active={brandFilter === brandType.value}
                onClick={() => onNavigate(brandType.value === "all" ? "/products" : `/products?brand=${brandType.value}`)}
              >
                {brandType.label}
              </FilterChip>
            ))}
          </div>
          <div className="mt-4">
            <select
              value={brandTypeFilter}
              onChange={(event) => setBrandTypeFilter(event.target.value)}
              className="customer-input max-w-[240px]"
            >
              <option value="all">All Brand Types</option>
              {brandTypeOptions.map((brandType) => (
                <option key={brandType.id} value={brandType.id}>
                  {brandType.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading products...
          </div>
        ) : error ? (
          <div className="mt-10 rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-center text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        ) : visibleProducts.length ? (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => {
              const storefrontProduct = toStorefrontProduct(product);

              return (
              <StoreProductCard
                key={product.id}
                product={storefrontProduct}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onViewProduct={(slug) => onNavigate(`/products/${slug}`)}
              />
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">No products found</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Try switching the brand filter or clear your search to view more products.
            </p>
          </div>
        )}
      </section>
    </StoreShell>
  );
}
