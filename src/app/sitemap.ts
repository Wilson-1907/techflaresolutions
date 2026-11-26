import type { MetadataRoute } from "next";
import { products, industries } from "@/data/site";
import { SITELINK_PAGES } from "@/data/seo";

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.techflare-solutions.com").replace(
  /\/$/,
  ""
);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const sitelinkRoutes = SITELINK_PAGES.map((page) => ({
    url: `${siteUrl}${page.url}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.95,
  }));

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/products",
    "/industries",
    "/innovation-hub",
    "/solutions",
    "/research",
    "/careers",
    "/contact",
    "/login",
    "/newsroom",
    "/newsroom/we-will-open-soon",
    "/newsroom/we-are-open",
    "/community",
    "/blog",
  ].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority:
      path === ""
        ? 1
        : ["/services", "/products", "/contact", "/login", "/community", "/innovation-hub"].includes(
              path
            )
          ? 0.95
          : 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Do not include #fragment URLs — invalid in the sitemap protocol and Google ignores/rejects them.
  const industryRoutes = industries.map((ind) => ({
    url: `${siteUrl}/industries/${ind.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Deduplicate by URL (sitelink pages also appear in staticRoutes)
  const seen = new Set<string>();
  return [...sitelinkRoutes, ...staticRoutes, ...productRoutes, ...industryRoutes].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
