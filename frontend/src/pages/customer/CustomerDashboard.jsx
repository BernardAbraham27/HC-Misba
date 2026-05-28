import { useEffect, useMemo, useState } from "react";
import CustomerLayout from "../../layouts/CustomerLayout";
import ProductBottle from "../../components/ProductBottle";
import { addToCart, getCartCount } from "../../services/cartService";
import { getProducts } from "../../services/productService";
import { getMyOrders } from "../../services/orderService";
import { featuredProducts, heroSlides } from "../../data/products";
import { useAuth } from "../../context/AuthContext";

function toneFromName(name = "") {
  const key = name.toLowerCase();
  if (key.includes("toilet") || key.includes("bath")) return "emerald";
  if (key.includes("floor")) return "sky";
  if (key.includes("kitchen")) return "mint";
  if (key.includes("dish")) return "blue";
  if (key.includes("glass")) return "cyan";
  if (key.includes("hand")) return "lime";
  if (key.includes("room")) return "sky";
  return "teal";
}

function mapFallbackProduct(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: product.category,
    price: product.originalPrice,
    discountPrice: product.price,
    rating: product.rating,
    sizes: product.sizes,
    shortDescription: product.tag,
    tone: product.tone,
  };
}

const fallbackProducts = heroSlides.map((slide, index) => {
  const featuredMatch = featuredProducts.find((item) => item.slug === slide.slug);
  const price = featuredMatch?.originalPrice ?? 149 + index * 10;
  const discountPrice = featuredMatch?.price ?? price - 30;
  const categoryName = featuredMatch?.category ?? slide.tags?.[0] ?? "Home Care";
  const sizes = featuredMatch?.sizes ?? ["500ml", "1L", "5L"];

  return mapFallbackProduct({
    id: slide.id,
    name: slide.name,
    slug: slide.slug,
    category: categoryName,
    price: discountPrice,
    originalPrice: price,
    rating: featuredMatch?.rating ?? 4.6,
    sizes,
    tone: slide.tone,
    tag: slide.description,
  });
});

export default function CustomerDashboard({ onNavigate, setToast }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productError, setProductError] = useState("");
  const [ordersError, setOrdersError] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [cartItemsCount, setCartItemsCount] = useState(() => getCartCount());

  useEffect(() => {
    document.title = "Customer Dashboard | God Grace Home Products";
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductError("");
        const data = await getProducts({ pageSize: 24 });
        setProducts((data.items || []).length ? data.items : fallbackProducts);
      } catch {
        setProductError("Showing curated products while live catalog sync is unavailable.");
        setProducts(fallbackProducts);
      } finally {
        setLoadingProducts(false);
      }
    };

    const loadOrders = async () => {
      try {
        setLoadingOrders(true);
        setOrdersError("");
        setOrders(await getMyOrders());
      } catch {
        setOrders([]);
        setOrdersError("Order history could not be loaded right now.");
      } finally {
        setLoadingOrders(false);
      }
    };

    loadProducts();
    loadOrders();
    setCartItemsCount(getCartCount());
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    let list = products.filter((product) => {
      const matchesSearch =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        (product.categoryName || "").toLowerCase().includes(normalized);
      const matchesCategory = !category || product.categoryName === category;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-low-to-high") {
      list = [...list].sort(
        (a, b) => Number(a.discountPrice ?? a.price) - Number(b.discountPrice ?? b.price),
      );
    } else if (sortBy === "price-high-to-low") {
      list = [...list].sort(
        (a, b) => Number(b.discountPrice ?? b.price) - Number(a.discountPrice ?? a.price),
      );
    }

    return list;
  }, [category, products, search, sortBy]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.categoryName).filter(Boolean))],
    [products],
  );

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === 1 || order.status === 2).length;
    const deliveredOrders = orders.filter((order) => order.status === 6).length;
    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cartItems: cartItemsCount,
    };
  }, [cartItemsCount, orders]);

  const handleAddToCart = async (product, size) => {
    await addToCart({
      productId: product.id,
      productName: product.name,
      categoryName: product.categoryName,
      size,
      quantity: 1,
      unitPrice: product.discountPrice ?? product.price,
      productImageUrl: product.imageUrl || "",
    });
    setCartItemsCount(getCartCount());
    setToast({ type: "success", message: `${product.name} added to cart.` });
  };

  const handleBuyNow = async (product, size) => {
    await handleAddToCart(product, size);
    onNavigate("/checkout");
  };

  const quickActions = [
    {
      title: "My Orders",
      text: "View your recent and past orders",
      button: "View Orders",
      onClick: () => onNavigate("/my-orders"),
    },
    {
      title: "Cart",
      text: "Continue checkout from your saved cart",
      button: "Go to Cart",
      onClick: () => onNavigate("/cart"),
    },
    {
      title: "Track Order",
      text: "Track order using order number and mobile number",
      button: "Track Now",
      onClick: () => onNavigate("/track-order"),
    },
    {
      title: "Profile",
      text: "Update your name, mobile, email, and address",
      button: "View Profile",
      onClick: () => onNavigate("/profile"),
    },
  ];

  return (
    <CustomerLayout title="Dashboard" onNavigate={onNavigate}>
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
          Welcome Back
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          Welcome back, {user?.fullName || "Customer"}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Shop home care essentials, track your orders, and manage your account.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((card) => (
          <article
            key={card.title}
            className="flex min-h-[196px] flex-col rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{card.text}</p>
            <button
              type="button"
              onClick={card.onClick}
              className="mt-5 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {card.button}
            </button>
          </article>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Total Orders", value: stats.totalOrders },
          { label: "Pending Orders", value: stats.pendingOrders },
          { label: "Delivered Orders", value: stats.deliveredOrders },
          { label: "Cart Items", value: stats.cartItems },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex min-h-[132px] flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
              {stat.label}
            </p>
            <p className="mt-4 text-3xl font-semibold leading-none text-slate-900 sm:text-[2rem]">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Recommended Products
            </span>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Recommended Home Care Products
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Shop cleaning essentials for your home, office, and daily hygiene.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="customer-input"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="customer-input"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
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
          </div>
        </div>

        {productError ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {productError}
          </div>
        ) : null}

        {ordersError ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {ordersError}
          </div>
        ) : null}

        {loadingProducts ? (
          <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Loading products...
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const selectedSize = product.sizes?.[0] || "500ml";
              return (
                <article
                  key={product.id}
                  className="flex min-h-[470px] flex-col rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {product.categoryName}
                    </span>
                    <span className="text-sm text-amber-500">
                      ★ {Number(product.rating || 4.6).toFixed(1)}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-center rounded-[1.5rem] bg-white py-4">
                    <ProductBottle
                      name={product.name}
                      badge={product.categoryName}
                      tone={product.tone || toneFromName(product.name)}
                      size="card"
                    />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{product.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {product.shortDescription || "Daily hygiene essential for cleaner spaces."}
                  </p>

                  <div className="mt-4 flex items-end gap-3">
                    <p className="text-2xl font-semibold text-slate-900">
                      Rs. {product.discountPrice ?? product.price}
                    </p>
                    {product.discountPrice ? (
                      <p className="text-sm text-slate-400 line-through">Rs. {product.price}</p>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(product.sizes || ["500ml", "1L", "5L"]).map((size) => (
                      <span
                        key={size}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {size}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto grid gap-3 pt-5">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product, selectedSize)}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyNow(product, selectedSize)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                      Buy Now
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/products/${product.slug}`)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                      View Product
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Recent Orders
            </span>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Your latest activity</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("/my-orders")}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            View Orders
          </button>
        </div>

        {loadingOrders ? (
          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Loading order summary...
          </div>
        ) : orders.length ? (
          <div className="mt-6 grid gap-4">
            {orders.slice(0, 3).map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => onNavigate(`/orders/${order.id}`)}
                className="flex flex-col gap-2 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:border-emerald-300 hover:bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Rs. {order.grandTotal}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {new Date(order.orderDate || order.createdAt).toLocaleString("en-IN")} • {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">No orders yet</h3>
            <p className="mt-3 text-sm text-slate-600">
              Once you place an order while logged in, it will appear here.
            </p>
          </div>
        )}
      </section>
    </CustomerLayout>
  );
}
