import { company } from "@/data/site";

export function JsonLd() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://www.techflare-solutions.com";

  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: company.name,
    legalName: company.name,
    alternateName: ["TechFlare Solutions Kenya"],
    url: base,
    logo: `${base}/logo.png`,
    image: `${base}/logo.png`,
    description: company.mission,
    email: company.email,
    telephone: company.phone,
    slogan: company.subtagline,
    areaServed: [
      { "@type": "Country", name: "Kenya" },
      { "@type": "Continent", name: "Africa" },
    ],
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "KE",
        addressLocality: "Karatina",
      },
    },
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
        availableLanguage: ["English"],
      },
    ],
    sameAs: [company.whatsappLink, company.communityWhatsApp].filter(Boolean),
    knowsAbout: [
      "Software Development",
      "Artificial Intelligence",
      "Innovation Consulting",
      "Blockchain Voting",
      "Research and Development",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: base,
    description: company.tagline,
    inLanguage: "en-KE",
    publisher: { "@type": "Organization", name: company.name, logo: `${base}/logo.png` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    image: `${base}/logo.png`,
    url: base,
    telephone: company.phone,
    email: company.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.offices[0].address,
      addressLocality: "Karatina",
      addressRegion: "Nyeri",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -0.4833,
      longitude: 37.1167,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
    </>
  );
}
