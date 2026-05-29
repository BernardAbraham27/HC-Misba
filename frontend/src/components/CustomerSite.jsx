import { useEffect, useMemo, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import { CubeIcon, ShieldIcon, SparklesIcon, TruckIcon } from "./IconSet";
import {
  allProducts,
  contactDetails,
  faqs,
  heroSlides,
  navLinks,
  reviews,
  socialLinks,
  toStorefrontProduct,
  whyChooseUsItems,
} from "../data/products";
import {
  canonicalUrl,
  organizationSchema,
  productSchemas,
  websiteSchema,
} from "../data/seo";
import { tickerItems } from "../data/tickerItems";
import { useAuth } from "../context/AuthContext";
import { addToCart, getCartCount, onCartUpdated } from "../services/cartService";
import { getProducts } from "../services/productService";
import { useMasterStore } from "../store/masterStore";

const trustBadges = [
  { label: "Quality Products", icon: ShieldIcon },
  { label: "Bulk Orders Available", icon: CubeIcon },
  { label: "Fast Delivery", icon: TruckIcon },
  { label: "Home & Commercial Use", icon: SparklesIcon },
];

const verseContent = {
  en: {
    label: "Our Guiding Verse",
    verse: "Whatever you do, work at it with all your heart, as working for the Lord.",
    reference: "Colossians 3:23",
    line: "Serving every home with quality, care, and honesty.",
    button: "தமிழ்",
  },
  ta: {
    label: "எங்கள் வழிகாட்டும் வசனம்",
    verse: "நீங்கள் எதைச் செய்தாலும், மனிதருக்காக அல்ல, கர்த்தருக்காகச் செய்கிறதுபோல் மனமாரச் செய்யுங்கள்.",
    reference: "கொலோசெயர் 3:23",
    line: "தரம், அக்கறை, நேர்மையுடன் ஒவ்வொரு இல்லத்திற்கும் சேவை செய்கிறோம்.",
    button: "EN",
  },
};

function SectionIntro({ kicker, title, copy, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className="section-kicker">{kicker}</span>
      <h2 className="section-title">{title}</h2>
      <p className="section-copy">{copy}</p>
    </div>
  );
}

function TranslateIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M4 5h8M8 3v2m4 0c0 3.2-1.5 6-4 8m1.7-2a13 13 0 0 0 4.3 3M14 19l3-8 3 8m-5.8-2h5.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ProductCard({ product, onAddToCart, onViewProduct }) {
  return (
    <article className="group flex h-full flex-col rounded-[2rem] border border-[#DCE8F5] bg-white p-5 shadow-[0_18px_50px_rgba(16,35,63,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(21,91,213,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.badgeClass}`}>
            {product.brandType}
          </span>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7C93]">
            {product.brandName}
          </p>
        </div>
        <span className="rounded-full bg-[#EEF6FF] px-3 py-1 text-xs font-semibold text-[#155BD5]">
          {product.category}
        </span>
      </div>

      <div className="mt-5 rounded-[1.7rem] bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.14),transparent_40%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] p-4">
        <div className="flex h-52 items-center justify-center rounded-[1.3rem] bg-white">
          <img
            src={product.imageUrl}
            alt={product.alt}
            loading="lazy"
            className="h-44 w-full object-contain"
          />
        </div>
      </div>

      <h3 className="mt-5 text-xl font-semibold text-[#10233F]">{product.name}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6B7C93]">{product.shortDescription}</p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-2xl font-semibold text-[#10233F]">Rs {product.price}</p>
        <p className="text-sm font-medium text-[#6B7C93]">{product.size}</p>
      </div>

      <div className="mt-auto grid gap-3 pt-5">
        <button
          type="button"
          onClick={() => onAddToCart(product, product.sizes[0])}
          className="rounded-2xl bg-[#155BD5] px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-[#124eb9]"
        >
          Add to Cart
        </button>
        <button
          type="button"
          onClick={() => onViewProduct(product.slug)}
          className="rounded-2xl border border-[#DCE8F5] bg-white px-4 py-3 text-sm font-semibold text-[#10233F] transition hover:border-[#155BD5] hover:text-[#155BD5]"
        >
          View Details
        </button>
      </div>
    </article>
  );
}

export default function CustomerSite({ onNavigate, setToast }) {
  const { isAdmin, isAuthenticated, logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [catalogProducts, setCatalogProducts] = useState(allProducts);
  const [verseLang, setVerseLang] = useState("en");
  const brands = useMasterStore((snapshot) => snapshot.brands);
  const masterCategories = useMasterStore((snapshot) => snapshot.categories);
  const hero = heroSlides[0];

  useEffect(() => {
    const loadCatalog = async () => {
      const productData = await getProducts({ pageSize: 50 });
      const nextProducts = (productData.items || [])
        .map((product) => toStorefrontProduct(product))
        .filter(Boolean);

      if (nextProducts.length) {
        setCatalogProducts(nextProducts);
      }
    };

    loadCatalog().catch(() => {});
  }, []);

  useEffect(() => {
    document.title = "God Grace Home Products | Premium Cleaning Products";

    const schemas = [organizationSchema, websiteSchema, ...productSchemas];
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-schema", "god-grace");
    script.textContent = JSON.stringify(schemas);
    document.head.appendChild(script);

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    return () => script.remove();
  }, []);

  useEffect(() => onCartUpdated(setCartCount), []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) return catalogProducts;
    return catalogProducts.filter((product) =>
      [product.name, product.brandName, product.category, product.shortDescription]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [catalogProducts, normalizedSearch]);

  const heroProducts = useMemo(
    () =>
      [
        "mispa-fabric-conditioner-blue",
        "mispa-detergent-liquid",
        "mispa-disinfectant-toilet-cleaner-5l",
      ]
        .map((slug) => catalogProducts.find((product) => product.slug === slug) || allProducts.find((product) => product.slug === slug))
        .filter(Boolean),
    [catalogProducts],
  );

  const normalizedBrands = brands.map((brand) => ({
    ...brand,
    imageUrl: brand.logoUrl || brand.logoPath || "",
    slug: brand.slug || brand.code?.toLowerCase().replace(/_/g, "-") || "",
    badge: brand.brandTypeName || "Partner Brand",
    isOwnBrand: (brand.brandTypeName || "").toLowerCase() === "own brand",
  }));
  const ourBrands = normalizedBrands.filter((brand) => brand.isOwnBrand);
  const partnerBrands = normalizedBrands.filter((brand) => !brand.isOwnBrand);
  const featuredProducts = filteredProducts.slice(0, 8);
  const categories = masterCategories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    imageUrl:
      catalogProducts.find((product) => product.category === category.name)?.imageUrl ||
      "/assets/images/brands/god-grace-logo.png",
  }));

  const headerNavLinks = isAdmin
    ? [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
      ]
    : navLinks;

  const handleAddToCart = async (product, selectedSize) => {
    await addToCart({
      productId: product.id,
      productName: product.name,
      categoryName: product.category,
      size: selectedSize,
      quantity: 1,
      unitPrice: product.price,
      productImageUrl: product.imageUrl,
    });

    setToast({ type: "success", message: `${product.name} added to cart.` });
  };

  const handleLogout = () => {
    logout();
    setToast({ type: "success", message: "Logged out successfully." });
    onNavigate("/", { replace: true });
  };

  const verse = verseContent[verseLang];

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F4F8FC] text-[#10233F]">
      <Header
        navLinks={headerNavLinks}
        cartCount={cartCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        authState={{ isAdmin, isAuthenticated, user }}
        announcementItems={tickerItems}
        onNavigateLink={onNavigate}
        onCartClick={() => onNavigate("/cart")}
        onLoginClick={() => onNavigate("/login")}
        onDashboardClick={() => onNavigate("/customer/dashboard")}
        onMyOrdersClick={() => onNavigate("/account")}
        onAdminDashboardClick={() => onNavigate("/admin/dashboard")}
        onLogoutClick={handleLogout}
      />

      <main className="pb-24 pt-[118px] md:pb-0">
        <section
          id="home"
          className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(21,91,213,0.16),transparent_30%),linear-gradient(180deg,#eef6ff_0%,#f9fcff_50%,#f4f8fc_100%)]"
        >
          <div className="section-shell relative py-14 sm:py-16 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-white/70 bg-[rgba(255,255,255,0.68)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#155BD5] shadow-sm backdrop-blur">
                  Premium Cleaning Products
                </span>
                <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-[#10233F] sm:text-5xl lg:text-[3.7rem]">
                  {hero.name}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[#6B7C93] sm:text-lg">
                  {hero.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate("/products")}
                    className="rounded-full bg-[#155BD5] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-[#124eb9]"
                  >
                    Shop Products
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("/#bulk-orders")}
                    className="rounded-full border border-[#DCE8F5] bg-white/90 px-6 py-3 text-sm font-semibold text-[#10233F] shadow-sm transition hover:scale-[1.01] hover:border-[#155BD5] hover:text-[#155BD5]"
                  >
                    Request Bulk Order
                  </button>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {trustBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={badge.label}
                        className="rounded-[1.4rem] border border-[rgba(255,255,255,0.7)] bg-[rgba(255,255,255,0.46)] px-4 py-4 shadow-[0_16px_42px_rgba(21,91,213,0.1)] backdrop-blur"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF6FF] text-[#155BD5]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-[#10233F]">{badge.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute -left-6 top-10 h-40 w-40 rounded-full bg-[#14B8A6]/15 blur-3xl" />
                <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#155BD5]/15 blur-3xl" />
                <div className="grid gap-4 lg:justify-items-end">
                  {heroProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`w-full max-w-[26rem] rounded-[1.8rem] border border-[rgba(255,255,255,0.72)] bg-[rgba(255,255,255,0.62)] p-4 shadow-[0_22px_65px_rgba(16,35,63,0.12)] backdrop-blur ${
                        index === 1 ? "lg:mr-10" : index === 2 ? "lg:mr-4" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4 rounded-[1.3rem] bg-white p-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#EEF6FF] p-3">
                          <img
                            src={product.imageUrl}
                            alt={product.alt}
                            className="h-20 w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#155BD5]">
                            {product.brandName}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-[#10233F]">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-[#6B7C93]">{product.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell py-12">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-[2rem] border border-[#DCE8F5] bg-white px-6 py-8 text-center shadow-[0_22px_50px_rgba(16,35,63,0.08)] transition duration-300 sm:px-8">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setVerseLang((current) => (current === "en" ? "ta" : "en"))}
                  className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F5] bg-[#EEF6FF] px-3 py-2 text-xs font-semibold text-[#155BD5] transition hover:bg-white"
                >
                  <TranslateIcon />
                  {verse.button}
                </button>
              </div>
              <div key={verseLang} className="animate-[fadeUp_300ms_ease-out]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7C93]">
                  {verse.label}
                </p>
                <p className="mx-auto mt-5 max-w-3xl text-2xl font-semibold leading-10 text-[#10233F] sm:text-[1.9rem]">
                  “{verse.verse}”
                </p>
                <p className="mt-5 text-base font-semibold text-[#155BD5]">{verse.reference}</p>
                <p className="mt-3 text-sm leading-7 text-[#6B7C93] sm:text-base">{verse.line}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="brands" className="section-shell py-12">
          <SectionIntro
            kicker="Our Brands"
            title="Own brands built under God Grace Home Products"
            copy="MISPA and RAINBOW are our own-brand lines, each presented with their correct ownership badge and real logo assets."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {ourBrands.map((brand) => (
              <article
                key={brand.id}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate(`/products?brand=${brand.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onNavigate(`/products?brand=${brand.slug}`);
                  }
                }}
                className="rounded-[2rem] border border-[#DCE8F5] bg-white p-6 text-left shadow-[0_16px_42px_rgba(16,35,63,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(16,35,63,0.12)] focus:outline-none focus:ring-2 focus:ring-[#155BD5]/30"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF6FF] p-4">
                    <img src={brand.imageUrl} alt={`${brand.name} logo`} className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <span className="rounded-full bg-[#DDF7EA] px-3 py-1 text-xs font-semibold text-[#087443]">
                      Own Brand
                    </span>
                    <h3 className="mt-3 text-2xl font-semibold text-[#10233F]">{brand.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#6B7C93]">{brand.description}</p>
                    <p className="mt-3 text-sm font-semibold text-[#155BD5]">View products</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell py-12">
          <SectionIntro
            kicker="Partner Brands"
            title="Third-party and partner labels in the catalog"
            copy="CLEANBOY and Easy Clean are kept separate from our own-brand lines so ownership stays clear everywhere in the storefront."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {partnerBrands.map((brand) => (
              <article
                key={brand.id}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate(`/products?brand=${brand.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onNavigate(`/products?brand=${brand.slug}`);
                  }
                }}
                className="rounded-[2rem] border border-[#DCE8F5] bg-white p-6 text-left shadow-[0_16px_42px_rgba(16,35,63,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(16,35,63,0.12)] focus:outline-none focus:ring-2 focus:ring-[#155BD5]/30"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF6FF] p-4">
                    <img src={brand.imageUrl} alt={`${brand.name} logo`} className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        brand.name === "CLEANBOY"
                          ? "bg-[#EAF2FF] text-[#155BD5]"
                          : "bg-[#EEF6FF] text-[#10233F]"
                      }`}
                    >
                      {brand.badge}
                    </span>
                    <h3 className="mt-3 text-2xl font-semibold text-[#10233F]">{brand.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#6B7C93]">{brand.description}</p>
                    <p className="mt-3 text-sm font-semibold text-[#155BD5]">View products</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="featured-products" className="section-shell py-12">
          <SectionIntro
            kicker="Featured Products"
            title="Transparent PNG product cards with real uploaded visuals"
            copy="The storefront now uses the cleaned local PNG cutouts for featured products instead of mock bottles or placeholder illustrations."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewProduct={(slug) => onNavigate(`/products/${slug}`)}
              />
            ))}
          </div>
        </section>

        <section id="categories" className="section-shell py-12">
          <SectionIntro
            kicker="Categories"
            title="Shop by cleaning need"
            copy="A tighter category list keeps the storefront focused on the exact household and business cleaning products in the current catalog."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onNavigate(`/products?categoryId=${category.id}`)}
                className="rounded-[1.8rem] border border-[#DCE8F5] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-44 items-center justify-center rounded-[1.3rem] bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] p-4">
                  <img
                    src={category.imageUrl}
                    alt={`${category.name} category`}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#10233F]">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7C93]">{category.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section id="bulk-orders" className="section-shell py-12">
          <div className="overflow-hidden rounded-[2.2rem] border border-[#DCE8F5] bg-[linear-gradient(135deg,#155BD5_0%,#1e77e6_45%,#14B8A6_100%)] text-white shadow-[0_26px_70px_rgba(21,91,213,0.2)]">
            <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="p-8 sm:p-10">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                  Bulk Orders
                </span>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                  Premium cleaning supplies for home and commercial use
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-100 sm:text-base">
                  Request bulk supply for homes, stores, offices, hotels, and recurring housekeeping needs through a cleaner, commerce-focused enquiry flow.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate("/#contact")}
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#10233F] transition hover:bg-[#EEF6FF]"
                  >
                    Request Bulk Quote
                  </button>
                  <a
                    href={contactDetails.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
                  >
                    WhatsApp Enquiry
                  </a>
                </div>
              </div>
              <div className="grid gap-4 bg-white/10 p-6 sm:grid-cols-2 sm:p-8">
                {heroProducts.map((product) => (
                  <div key={product.id} className="rounded-[1.7rem] bg-white p-4 text-[#10233F]">
                    <div className="flex h-40 items-center justify-center rounded-[1.3rem] bg-[#EEF6FF] p-3">
                      <img src={product.imageUrl} alt={product.alt} className="h-full w-full object-contain" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{product.name}</h3>
                  </div>
                ))}
                <div className="rounded-[1.7rem] bg-white p-4 text-[#10233F]">
                  <div className="flex h-40 items-center justify-center rounded-[1.3rem] bg-[#EEF6FF] p-3">
                    <img
                      src="/assets/images/products/transparent/cleanboy-washing-liquid-5l.png"
                      alt="CLEANBOY Washing Liquid 5L"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">CLEANBOY Washing Liquid 5L</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell py-12">
          <SectionIntro
            kicker="Why Choose Us"
            title="Clean, premium, customer-friendly shopping"
            copy="Every section is designed to stay readable, brand-correct, and firmly focused on ecommerce rather than the older home-care/medical direction."
            align="center"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseUsItems.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-[#DCE8F5] bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-[#10233F]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6B7C93]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="offers" className="section-shell py-12">
          <SectionIntro
            kicker="Offers"
            title="Buy 2 MISPA favourites and save more"
            copy="A dedicated offers path is also available, but this home section highlights current own-brand and partner-brand promotions at a glance."
          />
          <div className="mt-8 rounded-[2rem] bg-[linear-gradient(135deg,#155BD5_0%,#2371f2_100%)] p-6 text-white shadow-[0_22px_60px_rgba(21,91,213,0.18)]">
            <h3 className="text-2xl font-semibold">Buy 2 MISPA favourites and save more</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-100">
              Pair fabric conditioner with detergent liquid or add the 5L toilet cleaner for a stronger basket.
            </p>
          </div>
        </section>

        <section className="section-shell py-12">
          <SectionIntro
            kicker="Reviews"
            title="What customers are saying"
            copy="Feedback from retail, home, and commercial customers who shop the current God Grace lineup."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-[1.8rem] border border-[#DCE8F5] bg-white p-6 shadow-sm"
              >
                <p className="text-sm leading-7 text-[#6B7C93]">"{review.comment}"</p>
                <h3 className="mt-5 text-lg font-semibold text-[#10233F]">{review.name}</h3>
                <p className="text-sm text-[#155BD5]">{review.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell py-12">
          <SectionIntro
            kicker="FAQ"
            title="Frequently Asked Questions"
            copy="Quick answers about brand ownership, image usage, and ordering."
          />
          <div className="mt-8 grid gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-[1.6rem] border border-[#DCE8F5] bg-white p-5 shadow-sm"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-[#10233F]">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-[#6B7C93]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="section-shell py-12">
          <div className="overflow-hidden rounded-[2.2rem] border border-[#DCE8F5] bg-white shadow-[0_22px_60px_rgba(16,35,63,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="bg-[linear-gradient(135deg,#10233F_0%,#155BD5_55%,#14B8A6_100%)] p-8 text-white sm:p-10">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                  Contact
                </span>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Talk to GOD GRACE Home Products</h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-100 sm:text-base">
                  Reach out for product enquiries, delivery support, and bulk order discussions.
                </p>
                <div className="mt-8 grid gap-4">
                  <a href={`tel:${contactDetails.phone.replace(/\s+/g, "")}`} className="rounded-[1.4rem] border border-white/15 bg-white/10 px-5 py-4 text-sm font-medium backdrop-blur">
                    {contactDetails.phone}
                  </a>
                  <a href={`mailto:${contactDetails.email}`} className="rounded-[1.4rem] border border-white/15 bg-white/10 px-5 py-4 text-sm font-medium backdrop-blur">
                    {contactDetails.email}
                  </a>
                  <div className="rounded-[1.4rem] border border-white/15 bg-white/10 px-5 py-4 text-sm font-medium backdrop-blur">
                    {contactDetails.address}
                  </div>
                </div>
              </div>
              <div className="grid gap-4 bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] p-6 sm:grid-cols-2 sm:p-8">
                {heroProducts.concat(filteredProducts.find((item) => item.slug === "cleanboy-dishwash-liquid")).filter(Boolean).map((product) => (
                  <div key={product.id} className="rounded-[1.7rem] bg-white p-4">
                    <div className="flex h-40 items-center justify-center rounded-[1.3rem] bg-[#EEF6FF] p-3">
                      <img src={product.imageUrl} alt={product.alt} className="h-full w-full object-contain" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-[#10233F]">{product.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        navLinks={navLinks}
        categories={categories.map((category) => category.name)}
        contactDetails={contactDetails}
        socialLinks={socialLinks}
        onNavigate={onNavigate}
      />
      {!isAdmin ? <MobileBottomNav cartCount={cartCount} onNavigate={onNavigate} /> : null}
    </div>
  );
}
