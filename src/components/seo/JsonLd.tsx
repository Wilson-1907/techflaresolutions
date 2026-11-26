import { company, services, products } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.techflare-solutions.com";

export function JsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    email: company.email,
    telephone: company.phone,
    foundingDate: company.founded,
    description:
      "TechFlare Solutions delivers technology, research, software, AI, automation, and idea-to-product solutions.",
    address: {
      "@type": "PostalAddress",
      addressLocality: company.offices[0]?.city,
      addressCountry: "KE",
    },
    sameAs: company.social?.links?.map((l) => l.href) ?? [],
    knowsAbout: [
      "technology",
      "research",
      "software",
      "artificial intelligence",
      "ideas",
      "automation",
      "point of sale",
      "education technology",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const offerCatalog = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "TechFlare Solutions Services & Products",
    itemListElement: [
      ...services.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
          url: `${siteUrl}/services#${s.slug}`,
        },
      })),
      ...products.map((p, i) => ({
        "@type": "Offer",
        position: services.length + i + 1,
        itemOffered: {
          "@type": "SoftwareApplication",
          name: p.title,
          description: p.description,
          url: `${siteUrl}/products/${p.slug}`,
          applicationCategory: "BusinessApplication",
        },
      })),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalog) }}
      />
    </>
  );
}
