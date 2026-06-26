import { apiUrl } from "@/lib/api-base";
import { products as staticProducts, type Product, type ProductStatus } from "@/data/site";

export type ApiProduct = {
  id?: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
  image?: string;
  externalUrl?: string;
  features?: string[];
  howItWorks?: string[];
  pricing?: Product["pricing"];
  source?: string;
  innovatorName?: string | null;
};

function mapProduct(item: ApiProduct): Product {
  return {
    slug: item.slug,
    title: item.title,
    tagline: item.tagline,
    description: item.description,
    status: item.status as ProductStatus,
    image: item.image,
    externalUrl: item.externalUrl,
    features: item.features || [],
    howItWorks: item.howItWorks,
    pricing: item.pricing,
    source: item.source === "innovator" ? "innovator" : "techflare",
    innovatorName: item.innovatorName || undefined,
  };
}

export async function loadProducts(): Promise<Product[]> {
  try {
    const res = await fetch(apiUrl("/api/catalog"), { cache: "no-store" });
    if (!res.ok) return staticProducts;
    const data = await res.json();
    const remote = (data.products ?? []) as ApiProduct[];
    if (remote.length === 0) return staticProducts;
    return remote.map(mapProduct);
  } catch {
    return staticProducts;
  }
}

export async function loadProductBySlug(slug: string): Promise<Product | null> {
  const staticMatch = staticProducts.find((p) => p.slug === slug);
  try {
    const res = await fetch(apiUrl(`/api/catalog/${slug}`), { cache: "no-store" });
    if (!res.ok) return staticMatch ?? null;
    const data = await res.json();
    if (!data.product) return staticMatch ?? null;
    return mapProduct(data.product);
  } catch {
    return staticMatch ?? null;
  }
}
