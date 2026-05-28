export const brands = [
  {
    id: "mispa",
    name: "MISPA",
    type: "Own Brand",
    description: "Signature fabric and laundry care made for everyday freshness.",
    logo: require("../../assets/images/brands/mispa-logo.png"),
    colors: ["#d7efff", "#8ecbff"],
  },
  {
    id: "rainbow",
    name: "RAINBOW",
    type: "Own Brand",
    description: "Fragrant sanitizers with bright variants for every room.",
    logo: require("../../assets/images/brands/rainbow-logo.png"),
    colors: ["#fff3d6", "#ffd76b"],
  },
  {
    id: "cleanboy",
    name: "CLEANBOY",
    type: "Third-Party",
    description: "Trusted partner liquids for dishwash and laundry care.",
    logo: require("../../assets/images/brands/cleanboy-logo.png"),
    colors: ["#d9f4ff", "#7bd2ff"],
  },
  {
    id: "easy-clean",
    name: "Easy Clean",
    type: "Partner Brand",
    description: "Partner brand displayed until product images are added.",
    logo: require("../../assets/images/brands/easy-clean-logo.png"),
    colors: ["#ebf7ff", "#c4e4ff"],
  },
];

function buildProduct(product) {
  return {
    rating: 4.8,
    reviews: 124,
    mrp: Math.round(product.price * 1.14),
    description: "Household cleaning essential made for a fresh, polished home.",
    highlights: [
      "Easy to use in daily cleaning routines",
      "Designed for neat shelf-ready storage",
      "Suitable for modern home-care needs",
    ],
    sizes: [product.size],
    ...product,
  };
}

export const products = [
  buildProduct({
    id: 1,
    slug: "mispa-fabric-conditioner-blue",
    name: "MISPA Fabric Conditioner Blue",
    brand: "MISPA",
    brandType: "Own Brand",
    category: "Fabric Care",
    size: "500ml",
    sizes: ["500ml", "1L"],
    price: 165,
    mrp: 189,
    rating: 4.9,
    reviews: 382,
    image: require("../../assets/images/products/transparent/mispa-fabric-conditioner-blue.png"),
    description: "A soft-touch fabric conditioner that leaves every load fresh, light, and gentle on clothes.",
    highlights: [
      "Makes clothes soft and gentle on skin",
      "Protects fabric colours and fibres",
      "Long-lasting freshness",
      "Suitable for hand and machine wash",
    ],
  }),
  buildProduct({
    id: 2,
    slug: "mispa-fabric-conditioner-pink",
    name: "MISPA Fabric Conditioner Pink",
    brand: "MISPA",
    brandType: "Own Brand",
    category: "Fabric Care",
    size: "500ml",
    sizes: ["500ml", "1L"],
    price: 165,
    mrp: 189,
    rating: 4.9,
    reviews: 412,
    image: require("../../assets/images/products/transparent/mispa-fabric-conditioner-pink.png"),
    description: "A floral fabric conditioner for soft garments, gentle fibres, and a bright fresh-wash finish.",
    highlights: [
      "Makes clothes soft and gentle on skin",
      "Protects fabric colours and fibres",
      "Long-lasting freshness",
      "Suitable for hand and machine wash",
    ],
  }),
  buildProduct({
    id: 3,
    slug: "mispa-detergent-liquid",
    name: "MISPA Detergent Liquid",
    brand: "MISPA",
    brandType: "Own Brand",
    category: "Laundry Liquid",
    size: "500ml",
    price: 149,
    mrp: 169,
    rating: 4.7,
    reviews: 265,
    image: require("../../assets/images/products/transparent/mispa-detergent-liquid.png"),
    description: "Bright blue detergent liquid for regular loads, fast rinsing, and crisp everyday laundry.",
    highlights: [
      "Fresh wash feel with every use",
      "Suitable for regular laundry loads",
      "Neat bottle design for easy storage",
    ],
  }),
  buildProduct({
    id: 4,
    slug: "mispa-disinfectant-toilet-cleaner-5l",
    name: "MISPA Disinfectant Toilet Cleaner 5L",
    brand: "MISPA",
    brandType: "Own Brand",
    category: "Toilet Cleaner",
    size: "5L",
    price: 299,
    mrp: 339,
    rating: 4.8,
    reviews: 141,
    image: require("../../assets/images/products/transparent/mispa-disinfectant-toilet-cleaner-5l.png"),
    description: "Heavy-duty toilet cleaner in a large family and commercial value pack.",
    highlights: [
      "Large 5L economy size",
      "Designed for deep washroom cleaning",
      "Convenient bulk handle pack",
    ],
  }),
  buildProduct({
    id: 5,
    slug: "rainbow-rose",
    name: "RAINBOW Rose Sanitizer",
    brand: "RAINBOW",
    brandType: "Own Brand",
    category: "Sanitizer",
    size: "500ml",
    price: 89,
    mrp: 99,
    rating: 4.6,
    reviews: 188,
    image: require("../../assets/images/products/transparent/rainbow-rose.png"),
    description: "Rose sanitizer with a bright floral identity and quick freshening for daily surfaces.",
    highlights: [
      "Floral rose fragrance",
      "Bright shelf-ready bottle",
      "Great for everyday home freshness",
    ],
  }),
  buildProduct({
    id: 6,
    slug: "rainbow-jasmine",
    name: "RAINBOW Jasmine Sanitizer",
    brand: "RAINBOW",
    brandType: "Own Brand",
    category: "Sanitizer",
    size: "500ml",
    price: 89,
    mrp: 99,
    rating: 4.6,
    reviews: 174,
    image: require("../../assets/images/products/transparent/rainbow-jasmine.png"),
    description: "Jasmine sanitizer made for fragrant home care and easy repeat use.",
    highlights: [
      "Soft jasmine fragrance",
      "Colourful bottle for quick recognition",
      "Ideal for daily cleaning routines",
    ],
  }),
  buildProduct({
    id: 7,
    slug: "rainbow-lemon",
    name: "RAINBOW Lemon Sanitizer",
    brand: "RAINBOW",
    brandType: "Own Brand",
    category: "Sanitizer",
    size: "500ml",
    price: 89,
    mrp: 99,
    rating: 4.7,
    reviews: 196,
    image: require("../../assets/images/products/transparent/rainbow-lemon.png"),
    description: "Lemon sanitizer with a bright citrus mood for quick kitchen and home care tasks.",
    highlights: [
      "Fresh lemon fragrance",
      "Lively, easy-to-spot packaging",
      "Useful for quick home-cleaning touchups",
    ],
  }),
  buildProduct({
    id: 8,
    slug: "cleanboy-dishwash-liquid",
    name: "CLEANBOY Dishwash Liquid",
    brand: "CLEANBOY",
    brandType: "Third-Party",
    category: "Dishwash",
    size: "500ml",
    price: 120,
    mrp: 139,
    rating: 4.5,
    reviews: 154,
    image: require("../../assets/images/products/transparent/cleanboy-dishwash-liquid.png"),
    description: "Dishwash liquid from our partner range for everyday grease-cutting kitchen use.",
    highlights: [
      "Made for daily utensils",
      "Bright liquid bottle format",
      "Partner brand kitchen essential",
    ],
  }),
  buildProduct({
    id: 9,
    slug: "cleanboy-washing-liquid-5l",
    name: "CLEANBOY Washing Liquid 5L",
    brand: "CLEANBOY",
    brandType: "Third-Party",
    category: "Laundry Liquid",
    size: "5L",
    price: 249,
    mrp: 289,
    rating: 4.6,
    reviews: 118,
    image: require("../../assets/images/products/transparent/cleanboy-washing-liquid-5l.png"),
    description: "Bulk washing liquid from our partner brand for repeat laundry loads and value buying.",
    highlights: [
      "Large 5L family pack",
      "Useful for regular laundry cycles",
      "Partner brand value option",
    ],
  }),
];

export const featuredProducts = products.slice(0, 6);
export const ownBrandProducts = products.filter((product) => product.brandType === "Own Brand");
export const thirdPartyProducts = products.filter(
  (product) => product.brandType === "Third-Party",
);
export const ourBrands = brands.filter((brand) => brand.type === "Own Brand");
export const partnerBrands = brands.filter((brand) => brand.type !== "Own Brand");

export const sampleCartItems = [
  { productId: 1, size: "500ml", quantity: 1 },
  { productId: 8, size: "500ml", quantity: 2 },
  { productId: 6, size: "500ml", quantity: 1 },
];

export const focusProductId = 2;

export function getProductById(productId) {
  return products.find((product) => product.id === productId);
}

export function getProductsByBrandType(brandType) {
  if (brandType === "Own Brand") {
    return ownBrandProducts;
  }

  if (brandType === "Third-Party") {
    return thirdPartyProducts;
  }

  return products;
}
