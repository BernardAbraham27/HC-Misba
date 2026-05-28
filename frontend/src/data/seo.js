import { heroSlides } from "./products";

export const canonicalUrl = "https://your-domain.com";

export const seoKeywords =
  "God Grace Home Products, home care products, home cleaning products, cleaning products online, house cleaning products, home hygiene products, household cleaning products, cleaning supplies online, best cleaning products for home, buy cleaning products online, toilet cleaner, toilet cleaner liquid, buy toilet cleaner online, floor cleaner, floor cleaner liquid, bathroom cleaner, bathroom cleaning liquid, kitchen cleaner, kitchen cleaning liquid, dishwash liquid, glass cleaner, handwash liquid, disinfectant liquid, phenyl cleaner, detergent liquid, laundry liquid, room freshener, air freshener for home, bulk cleaning products, housekeeping products supplier, cleaning products supplier in India, commercial cleaning products supplier, hotel cleaning products supplier, office cleaning products supplier";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "God Grace Home Products",
  description:
    "Home care products and cleaning products supplier for households, offices, hotels, institutions, and bulk orders.",
  url: canonicalUrl,
  email: "sales@godgracehomeproducts.com",
  telephone: "+91 98765 43210",
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "God Grace Home Products",
  url: canonicalUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${canonicalUrl}/products?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const productSchemas = heroSlides.map((product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  brand: {
    "@type": "Brand",
    name: "God Grace Home Products",
  },
  image: `${canonicalUrl}/og-image.jpg`,
  url: `${canonicalUrl}/products/${product.slug}`,
}));
