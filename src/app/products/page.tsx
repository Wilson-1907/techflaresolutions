import { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ProductCardImage, ProductCardActions, ProductStatusBadge } from "@/components/products/ProductCard";
import { buildEmailComposeLink } from "@/lib/mailto";
import { loadProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore TechFlare Solutions products — ready platforms, innovations in the fire, and coming releases.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await loadProducts();
  const techflareProducts = products.filter((p) => p.source !== "innovator");
  const innovatorProducts = products.filter((p) => p.source === "innovator");

  return (
    <>
      <PageHeader
        title="Our Products"
        subtitle="TechFlare-built solutions and innovator-shared products — ready, in the fire, and coming soon"
        badge="Products"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <GlassCard className="mb-10 border-gold/20 text-center py-6">
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every product here is engineered or curated by <strong className="text-gold">TechFlare Solutions</strong>.
              Status labels: <strong className="text-life-green">Ready</strong>, <strong className="text-gold">In the Fire</strong>, and <strong>Coming</strong>.
            </p>
          </GlassCard>

          <div className="grid gap-8 md:grid-cols-2">
            {techflareProducts.map((product, i) => (
              <GlassCard key={product.slug} delay={i * 0.1} className="flex flex-col">
                <div className="mb-4">
                  <ProductStatusBadge status={product.status} />
                </div>
                <ProductCardImage product={product} />
                <h2 className="text-2xl font-bold">{product.title}</h2>
                <p className="text-gold mt-1">{product.tagline}</p>
                <p className="mt-3 text-muted-foreground flex-1">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.features.map((f) => (
                    <span key={f} className="rounded-full bg-white/10 px-3 py-1 text-xs">{f}</span>
                  ))}
                </div>
                <ProductCardActions product={product} />
              </GlassCard>
            ))}
          </div>

          {innovatorProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Innovator Shared Products</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {innovatorProducts.map((product, i) => (
                  <GlassCard key={product.slug} delay={i * 0.1} className="flex flex-col border-life-green/20">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <ProductStatusBadge status={product.status} />
                      <span className="inline-flex items-center rounded-full border border-life-green/30 bg-life-green/10 px-3 py-1 text-xs font-semibold uppercase text-life-green">
                        Innovator · {product.innovatorName || "Partner"}
                      </span>
                    </div>
                    <ProductCardImage product={product} />
                    <h2 className="text-2xl font-bold">{product.title}</h2>
                    <p className="text-gold mt-1">{product.tagline}</p>
                    <p className="mt-3 text-muted-foreground flex-1">{product.description}</p>
                    <ProductCardActions product={product} />
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          <GlassCard className="mt-10 flex flex-col items-center justify-center text-center border-dashed border-gold/25 min-h-[240px]">
            <Sparkles className="h-12 w-12 text-gold/50 mb-4" />
            <h2 className="text-xl font-bold">More Products on the Way</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Our pipeline is active — enterprise tools, AI platforms, and innovator partnerships. Want early access?
            </p>
            <Button href={buildEmailComposeLink({ type: "general", label: "Product inquiry" })} className="mt-6">
              Email us
            </Button>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
