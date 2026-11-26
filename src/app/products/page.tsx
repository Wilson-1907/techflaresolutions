import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProductCardImage, ProductCardActions, ProductStatusBadge } from "@/components/products/ProductCard";
import { loadProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products — POS, CBE Pilot, Biometrics",
  description:
    "TechFlare Solutions products: Career Compass CBE in pilot, TechFlare POS and biometric systems in testing. Technology, software, AI, and automation.",
  keywords: [
    "POS",
    "point of sale",
    "CBE",
    "Career Compass",
    "biometric voting",
    "software products Kenya",
    "AI",
    "automation",
  ],
  alternates: { canonical: "/products" },
  robots: { index: true, follow: true },
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
        subtitle="CBE Career Compass is in pilot. POS, biometric voting, and attendance are in testing."
        badge="Products"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <GlassCard className="mb-10 border-cyan-400/20 text-center py-6">
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Status labels: <strong className="text-cyan-300">Pilot</strong> for active field trials,{" "}
              <strong className="text-gold">Testing</strong> for products under evaluation with partners.
              Every product is engineered by <strong className="text-foreground">TechFlare Solutions</strong>.
            </p>
          </GlassCard>

          <div className="grid gap-8 md:grid-cols-2">
            {techflareProducts.map((product, i) => (
              <GlassCard key={product.slug} delay={i * 0.08} className="flex flex-col">
                <div className="mb-4">
                  <ProductStatusBadge status={product.status} />
                </div>
                <ProductCardImage product={product} />
                <h2 className="font-display text-2xl font-semibold">{product.title}</h2>
                <p className="text-gold mt-1">{product.tagline}</p>
                <p className="mt-3 text-muted-foreground flex-1 leading-relaxed">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.features.map((f) => (
                    <span key={f} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs">
                      {f}
                    </span>
                  ))}
                </div>
                <ProductCardActions product={product} />
              </GlassCard>
            ))}
          </div>

          {innovatorProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-semibold mb-6">Innovator shared products</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {innovatorProducts.map((product, i) => (
                  <GlassCard key={product.slug} delay={i * 0.08} className="flex flex-col border-life-green/20">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <ProductStatusBadge status={product.status} />
                      <span className="inline-flex items-center rounded-full border border-life-green/30 bg-life-green/10 px-3 py-1 text-xs font-semibold uppercase text-life-green">
                        Innovator · {product.innovatorName || "Partner"}
                      </span>
                    </div>
                    <ProductCardImage product={product} />
                    <h2 className="font-display text-2xl font-semibold">{product.title}</h2>
                    <p className="text-gold mt-1">{product.tagline}</p>
                    <p className="mt-3 text-muted-foreground flex-1">{product.description}</p>
                    <ProductCardActions product={product} />
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
