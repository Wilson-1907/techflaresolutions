import { company, services, products } from "@/data/site";
import { SITELINK_PAGES, SEO_DEFAULT_DESCRIPTION } from "@/data/seo";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.techflare-solutions.com";

export function JsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: company.name,
    legalName: company.name,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${siteUrl}/logo.png`,
    email: company.email,
    telephone: company.phone,
    foundingDate: company.founded,
    description: SEO_DEFAULT_DESCRIPTION,
    address: company.offices.map((o) => ({
      "@type": "PostalAddress",
      addressLocality: o.city,
      addressCountry: "KE",
      streetAddress: o.address,
    })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: company.phone,
        contactType: "customer service",
        email: company.email,
        areaServed: "KE",
        availableLanguage: ["English", "Swahili"],
      },
    ],
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
    "@id": `${siteUrl}/#website`,
    name: company.name,
    alternateName: ["TechFlare", "TechFlare Solutions Kenya"],
    url: siteUrl,
    description: SEO_DEFAULT_DESCRIPTION,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-KE",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  /** Helps Google understand primary sitelink candidates. */
  const siteNavigation = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TechFlare Solutions main navigation",
    itemListElement: SITELINK_PAGES.map((page, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: page.name,
      description: page.description,
      url: `${siteUrl}${page.url}`,
    })),
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
          provider: { "@id": `${siteUrl}/#organization` },
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
          operatingSystem: "Web",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigation) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalog) }}
      />
    </>
  );
}
