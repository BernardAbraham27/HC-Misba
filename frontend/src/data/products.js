const productImage = (file) => `/assets/images/products/transparent/${file}`;
const brandImage = (file) => `/assets/images/brands/${file}`;

const sizes = {
  bottle: ["500ml", "1L"],
  can: ["5L"],
};

export const theme = {
  primary: "#155BD5",
  teal: "#14B8A6",
  navy: "#10233F",
  muted: "#6B7C93",
  background: "#F4F8FC",
  card: "#FFFFFF",
  lightBlue: "#EEF6FF",
  border: "#DCE8F5",
  success: "#22A06B",
};

export const ownBrandName = "GOD GRACE Home Products";
export const ownBrandSlug = "god-grace-home-products";

const brandMeta = {
  MISPA: {
    id: 1,
    name: "MISPA",
    slug: "mispa",
    brandType: "Own Brand",
    isOwnBrand: true,
    badgeClass: "bg-[#DDF7EA] text-[#087443]",
    logoUrl: brandImage("mispa-logo.png"),
    description: "Own-brand fabric care, laundry liquid, and toilet-cleaning essentials from God Grace.",
  },
  RAINBOW: {
    id: 2,
    name: "RAINBOW",
    slug: "rainbow",
    brandType: "Own Brand",
    isOwnBrand: true,
    badgeClass: "bg-[#DDF7EA] text-[#087443]",
    logoUrl: brandImage("rainbow-logo.png"),
    description: "Own-brand sanitizer variants with rose, jasmine, and lemon fragrance profiles.",
  },
  CLEANBOY: {
    id: 3,
    name: "CLEANBOY",
    slug: "cleanboy",
    brandType: "Third-Party",
    isOwnBrand: false,
    badgeClass: "bg-[#EAF2FF] text-[#155BD5]",
    logoUrl: brandImage("cleanboy-logo.png"),
    description: "Trusted third-party liquid cleaners for dishwash and laundry value packs.",
  },
  "Easy Clean": {
    id: 4,
    name: "Easy Clean",
    slug: "easy-clean",
    brandType: "Partner Brand",
    isOwnBrand: false,
    badgeClass: "bg-[#EEF6FF] text-[#10233F]",
    logoUrl: brandImage("easy-clean-logo.png"),
    description: "Partner brand listed in the catalog until dedicated product images are available.",
  },
};

function buildProduct({
  id,
  slug,
  name,
  brandName,
  category,
  size,
  sizes: sizeOptions,
  price,
  image,
  shortDescription,
  description,
  highlights,
  rating = 4.7,
  reviews = 126,
  isFeatured = false,
}) {
  const brand = brandMeta[brandName];

  return {
    id,
    slug,
    name,
    brandId: brand.id,
    brandName: brand.name,
    brandSlug: brand.slug,
    brandType: brand.brandType,
    isOwnBrand: brand.isOwnBrand,
    badgeClass: brand.badgeClass,
    category,
    size,
    sizes: sizeOptions,
    price,
    originalPrice: price,
    discountPrice: price,
    image,
    imageUrl: image,
    gallery: [image, image, image],
    shortDescription,
    description,
    benefits: highlights,
    highlights,
    howToUse: "Use as directed on the product label for the best cleaning results.",
    safetyInstructions: "Store tightly closed, keep away from children, and avoid direct eye contact.",
    rating,
    reviews,
    stockQuantity: 48,
    isBestSeller: isFeatured,
    isNewArrival: false,
    tag: isFeatured ? "Featured" : "",
    alt: `${name} transparent product image`,
  };
}

export const allProducts = [
  buildProduct({
    id: 1,
    slug: "mispa-fabric-conditioner-blue",
    name: "MISPA Fabric Conditioner Blue",
    brandName: "MISPA",
    category: "Fabric Care",
    size: "500ml",
    sizes: sizes.bottle,
    price: 165,
    image: productImage("mispa-fabric-conditioner-blue.png"),
    shortDescription: "Blue fabric conditioner for softer clothes and lasting freshness.",
    description: "MISPA Fabric Conditioner Blue keeps garments soft, fresh, and comfortable for daily family laundry.",
    highlights: [
      "Makes clothes soft and gentle on skin",
      "Protects fabric colours and fibres",
      "Long-lasting freshness",
      "Suitable for hand and machine wash",
    ],
    rating: 4.7,
    reviews: 126,
    isFeatured: true,
  }),
  buildProduct({
    id: 2,
    slug: "mispa-fabric-conditioner-pink",
    name: "MISPA Fabric Conditioner Pink",
    brandName: "MISPA",
    category: "Fabric Care",
    size: "500ml",
    sizes: sizes.bottle,
    price: 165,
    image: productImage("mispa-fabric-conditioner-pink.png"),
    shortDescription: "Pink fabric conditioner with a floral finish for everyday fabric care.",
    description: "MISPA Fabric Conditioner Pink delivers a soft fabric feel with a bright, fresh-wash fragrance profile.",
    highlights: [
      "Makes clothes soft and gentle on skin",
      "Protects fabric colours and fibres",
      "Long-lasting freshness",
      "Suitable for hand and machine wash",
    ],
    rating: 4.7,
    reviews: 126,
    isFeatured: true,
  }),
  buildProduct({
    id: 3,
    slug: "mispa-detergent-liquid",
    name: "MISPA Detergent Liquid",
    brandName: "MISPA",
    category: "Laundry Liquid",
    size: "500ml",
    sizes: sizes.bottle,
    price: 149,
    image: productImage("mispa-detergent-liquid.png"),
    shortDescription: "Laundry liquid for regular home washing with a clean, bright finish.",
    description: "MISPA Detergent Liquid is built for routine laundry with easy rinsing and reliable stain-lifting performance.",
    highlights: [
      "Effective for daily laundry loads",
      "Suitable for regular family use",
      "Fresh wash finish",
      "Works for hand and machine wash",
    ],
    rating: 4.7,
    reviews: 126,
    isFeatured: true,
  }),
  buildProduct({
    id: 4,
    slug: "mispa-disinfectant-toilet-cleaner-5l",
    name: "MISPA Disinfectant Toilet Cleaner 5L",
    brandName: "MISPA",
    category: "Toilet Cleaner",
    size: "5L",
    sizes: sizes.can,
    price: 299,
    image: productImage("mispa-disinfectant-toilet-cleaner-5l.png"),
    shortDescription: "5L disinfectant toilet cleaner for homes, stores, and commercial washrooms.",
    description: "MISPA Disinfectant Toilet Cleaner 5L is a value can made for larger-volume washroom cleaning and maintenance.",
    highlights: [
      "Large economy pack for repeated use",
      "Suitable for home and commercial washrooms",
      "Designed for regular toilet cleaning",
      "Easy-grip can format",
    ],
    rating: 4.7,
    reviews: 126,
    isFeatured: true,
  }),
  buildProduct({
    id: 5,
    slug: "rainbow-rose",
    name: "RAINBOW Rose Sanitizer",
    brandName: "RAINBOW",
    category: "Sanitizer",
    size: "500ml",
    sizes: sizes.bottle,
    price: 89,
    image: productImage("rainbow-rose.png"),
    shortDescription: "Rose fragrance sanitizer for pleasant, everyday freshening.",
    description: "RAINBOW Rose Sanitizer brings a floral fragrance option to daily household cleaning and freshness routines.",
    highlights: [
      "Rose fragrance profile",
      "Compact retail-ready bottle",
      "Good for daily home cleaning routines",
      "Easy to store and use",
    ],
  }),
  buildProduct({
    id: 6,
    slug: "rainbow-jasmine",
    name: "RAINBOW Jasmine Sanitizer",
    brandName: "RAINBOW",
    category: "Sanitizer",
    size: "500ml",
    sizes: sizes.bottle,
    price: 89,
    image: productImage("rainbow-jasmine.png"),
    shortDescription: "Jasmine fragrance sanitizer for regular home and shop use.",
    description: "RAINBOW Jasmine Sanitizer is a bright, easy-use variant for fresh-smelling everyday cleaning support.",
    highlights: [
      "Jasmine fragrance profile",
      "Compact retail-ready bottle",
      "Good for daily home cleaning routines",
      "Easy to store and use",
    ],
  }),
  buildProduct({
    id: 7,
    slug: "rainbow-lemon",
    name: "RAINBOW Lemon Sanitizer",
    brandName: "RAINBOW",
    category: "Sanitizer",
    size: "500ml",
    sizes: sizes.bottle,
    price: 89,
    image: productImage("rainbow-lemon.png"),
    shortDescription: "Lemon fragrance sanitizer with a fresh, clean everyday feel.",
    description: "RAINBOW Lemon Sanitizer offers a citrus-clean fragrance profile for routine household freshness and cleaning.",
    highlights: [
      "Lemon fragrance profile",
      "Compact retail-ready bottle",
      "Good for daily home cleaning routines",
      "Easy to store and use",
    ],
  }),
  buildProduct({
    id: 8,
    slug: "cleanboy-dishwash-liquid",
    name: "CLEANBOY Dishwash Liquid",
    brandName: "CLEANBOY",
    category: "Dishwash",
    size: "500ml",
    sizes: sizes.bottle,
    price: 120,
    image: productImage("cleanboy-dishwash-liquid.png"),
    shortDescription: "Third-party dishwash liquid for daily utensil cleaning and grease removal.",
    description: "CLEANBOY Dishwash Liquid is a partner-line kitchen cleaner designed for everyday sink-side use.",
    highlights: [
      "Made for daily utensil washing",
      "Convenient bottle format",
      "Kitchen-ready cleaning support",
      "Easy to handle for quick wash cycles",
    ],
  }),
  buildProduct({
    id: 9,
    slug: "cleanboy-washing-liquid-5l",
    name: "CLEANBOY Washing Liquid 5L",
    brandName: "CLEANBOY",
    category: "Laundry Liquid",
    size: "5L",
    sizes: sizes.can,
    price: 249,
    image: productImage("cleanboy-washing-liquid-5l.png"),
    shortDescription: "Third-party 5L laundry liquid for larger family and commercial loads.",
    description: "CLEANBOY Washing Liquid 5L is a value-focused third-party laundry cleaner for repeat washing needs.",
    highlights: [
      "Large 5L value pack",
      "Built for repeat laundry loads",
      "Suitable for home and shop use",
      "Easy-grip can format",
    ],
  }),
];

export const featuredProducts = allProducts;

export const heroSlides = [
  {
    id: 1,
    name: "Premium Cleaning Products for Home & Business",
    slug: "premium-cleaning-products",
    description: "Shop trusted dishwash liquid, detergent liquid, fabric conditioner, toilet cleaner, sanitizer fluid, bleaching powder, and bulk cleaning products from God Grace Home Products.",
  },
];

export const defaultBrands = [
  {
    id: 0,
    name: ownBrandName,
    slug: ownBrandSlug,
    badge: "Company",
    description: "The parent company behind MISPA and RAINBOW, serving homes and businesses with premium cleaning essentials.",
    imageUrl: brandImage("god-grace-logo.png"),
    isOwnBrand: true,
    isActive: true,
  },
  ...Object.values(brandMeta).map((brand) => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    badge: brand.brandType,
    description: brand.description,
    imageUrl: brand.logoUrl,
    isOwnBrand: brand.isOwnBrand,
    isActive: true,
  })),
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Brands", href: "/#brands" },
  { label: "Categories", href: "/#categories" },
  { label: "Bulk Orders", href: "/#bulk-orders" },
  { label: "Track Order", href: "/track-order" },
  { label: "Contact", href: "/#contact" },
];

export const categoryPills = [
  "Fabric Care",
  "Dishwash",
  "Laundry Liquid",
  "Toilet Cleaner",
  "Sanitizer",
  "Cleaning Essentials",
];

export const shopByNeedItems = [
  {
    id: "home",
    title: "Home Cleaning",
    description: "Daily-use bottles and cans for laundry, washrooms, kitchens, and freshening.",
    productNames: [
      "MISPA Fabric Conditioner Blue",
      "MISPA Detergent Liquid",
      "RAINBOW Jasmine Sanitizer",
    ],
  },
  {
    id: "business",
    title: "Business Supply",
    description: "Larger pack sizes for stores, offices, housekeeping teams, and repeat buyers.",
    productNames: [
      "MISPA Disinfectant Toilet Cleaner 5L",
      "CLEANBOY Washing Liquid 5L",
      "CLEANBOY Dishwash Liquid",
    ],
  },
];

export const whyChooseUsItems = [
  {
    title: "Quality Products",
    description: "A focused cleaning catalog built around reliable daily-use household and commercial essentials.",
  },
  {
    title: "Bulk Orders Available",
    description: "We support repeat and bulk purchase needs for homes, stores, offices, and institutional buyers.",
  },
  {
    title: "Fast Delivery",
    description: "A clean storefront and simple ordering flow make it easy to move from browsing to checkout quickly.",
  },
  {
    title: "Home & Commercial Use",
    description: "The range is suitable for family homes as well as business cleaning and housekeeping needs.",
  },
];

export const orderSteps = [
  "Browse Products",
  "Add to Cart",
  "Enter Delivery Address",
  "Choose Payment Method",
  "Place Order",
  "Track Delivery",
];

export const reviews = [
  {
    id: 1,
    name: "Sangeetha Traders",
    role: "Retail Customer",
    rating: 5,
    comment: "MISPA fabric conditioner and detergent liquid look premium and customers recognize them easily.",
  },
  {
    id: 2,
    name: "Lotus Residency",
    role: "Bulk Buyer",
    rating: 5,
    comment: "The 5L toilet cleaner and washing liquid packs are practical for regular housekeeping demand.",
  },
  {
    id: 3,
    name: "Mercy A",
    role: "Home Customer",
    rating: 5,
    comment: "The site feels clean and the real product images made it easy to pick the right items quickly.",
  },
];

export const faqs = [
  {
    question: "Do you support bulk orders?",
    answer: "Yes. God Grace Home Products supports both regular customer orders and bulk enquiries for shops, offices, and commercial buyers.",
  },
  {
    question: "Which brands are your own brands?",
    answer: "MISPA and RAINBOW are own brands. CLEANBOY is third-party, and Easy Clean is listed as a partner brand.",
  },
  {
    question: "Do product cards use real uploaded images?",
    answer: "Yes. The storefront uses local transparent PNG product cutouts from the uploaded assets rather than mock bottle illustrations.",
  },
  {
    question: "Can I shop from mobile and web?",
    answer: "Yes. The same product lineup is available across the web storefront and the mobile app experience.",
  },
];

export const contactDetails = {
  phone: "+91 95431 97916",
  email: "yoshvalmmanuel@gmail.com",
  address: "GOD GRACE Home Products, Chengalpattu - 603002",
  whatsapp: "https://wa.me/919543197916",
};

export const socialLinks = [
  { label: "WhatsApp", href: contactDetails.whatsapp, icon: "whatsapp" },
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
];

export function toStorefrontProduct(product) {
  if (!product) return null;

  const localMatch =
    allProducts.find((item) => item.id === Number(product.id)) ||
    allProducts.find((item) => item.slug === product.slug) ||
    allProducts.find((item) => item.name === product.name);

  const brandName = product.brandName || localMatch?.brandName || "MISPA";
  const brand = brandMeta[brandName] || brandMeta.MISPA;
  const currentPrice = Number(
    product.discountPrice ?? product.price ?? localMatch?.discountPrice ?? localMatch?.price ?? 0,
  );
  const listPrice = Number(
    product.price ?? product.originalPrice ?? localMatch?.originalPrice ?? currentPrice,
  );

  return {
    id: Number(product.id ?? localMatch?.id ?? 0),
    name: product.name || localMatch?.name || "",
    slug: product.slug || localMatch?.slug || "",
    category: product.categoryName || product.category || localMatch?.category || "Cleaning Essentials",
    categoryName: product.categoryName || product.category || localMatch?.category || "Cleaning Essentials",
    description: product.description || localMatch?.description || "",
    shortDescription: product.shortDescription || localMatch?.shortDescription || "",
    rating: Number(product.rating ?? localMatch?.rating ?? 4.7),
    reviews: Number(product.reviews ?? localMatch?.reviews ?? 126),
    price: currentPrice,
    originalPrice: listPrice,
    discountPrice: currentPrice,
    sizes: product.sizes?.length ? product.sizes : localMatch?.sizes || ["500ml"],
    size: product.size || localMatch?.size || "500ml",
    tag: product.tag || localMatch?.tag || "",
    benefits: product.benefits || localMatch?.benefits || [],
    highlights: product.highlights || localMatch?.highlights || [],
    howToUse: product.howToUse || localMatch?.howToUse || "",
    safetyInstructions: product.safetyInstructions || localMatch?.safetyInstructions || "",
    stockQuantity: Number(product.stockQuantity ?? localMatch?.stockQuantity ?? 20),
    brandId: Number(product.brandId ?? localMatch?.brandId ?? brand.id),
    brandName,
    brandSlug: product.brandSlug || localMatch?.brandSlug || brand.slug,
    brandType: product.brandType || localMatch?.brandType || brand.brandType,
    isOwnBrand:
      typeof product.isOwnBrand === "boolean"
        ? product.isOwnBrand
        : localMatch?.isOwnBrand ?? brand.isOwnBrand,
    isBestSeller:
      typeof product.isBestSeller === "boolean"
        ? product.isBestSeller
        : localMatch?.isBestSeller ?? false,
    isNewArrival:
      typeof product.isNewArrival === "boolean"
        ? product.isNewArrival
        : localMatch?.isNewArrival ?? false,
    badgeClass: localMatch?.badgeClass || brand.badgeClass,
    image: product.image || product.imageUrl || localMatch?.imageUrl || "",
    imageUrl: product.imageUrl || product.image || localMatch?.imageUrl || "",
    gallery: product.gallery?.length ? product.gallery : localMatch?.gallery || [],
    alt: product.alt || localMatch?.alt || `${product.name || localMatch?.name} product image`,
  };
}
