import type { MetadataRoute } from "next";
import { products, services, industries } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.techflare-solutions.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
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
        : path.includes("newsroom") || path === "/services" || path === "/products"
          ? 0.9
          : 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const serviceAnchors = services.map((s) => ({
    url: `${siteUrl}/services#${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const industryRoutes = industries.map((ind) => ({
    url: `${siteUrl}/industries/${ind.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...serviceAnchors, ...industryRoutes];
}
