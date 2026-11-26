import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.techflare-solutions.com").replace(
  /\/$/,
  ""
);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/services", "/products", "/contact", "/community"],
        disallow: ["/portal/", "/api/", "/pay"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/portal/", "/api/"],
      },
      {
        userAgent: "Google-InspectionTool",
        allow: "/",
        disallow: ["/portal/", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/portal/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
