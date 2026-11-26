"use client";

import { useEffect, useState } from "react";
import { ArrowRight, FlaskConical } from "lucide-react";
import { products as staticProducts, type Product } from "@/data/site";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ProductCardImage, ProductCardActions, ProductStatusBadge } from "@/components/products/ProductCard";
import { apiUrl } from "@/lib/api-base";

export function ProductsPreview() {
  const [products, setProducts] = useState<Product[]>(staticProducts.slice(0, 4));

  useEffect(() => {
    fetch(apiUrl("/api/catalog"))
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d) => {
        const remote = (d.products ?? []) as Product[];
        setProducts(remote.length > 0 ? remote.slice(0, 4) : staticProducts.slice(0, 4));
      })
      .catch(() => setProducts(staticProducts.slice(0, 4)));
  }, []);

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-cyan-300/90 text-sm font-semibold uppercase tracking-[0.22em]">
            Products
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-5xl tracking-tight">
            Built in-house. Proven in the field.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Career Compass CBE is in <strong className="text-cyan-300">pilot</strong>. POS, biometric
            voting, and attendance systems are in <strong className="text-gold">testing</strong>.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product, i) => (
            <GlassCard key={product.slug} delay={i * 0.08} className="h-full flex flex-col">
              <div className="mb-3 flex flex-wrap gap-2">
                <ProductStatusBadge status={product.status} />
                {product.source === "innovator" && (
                  <span className="text-xs text-life-green border border-life-green/30 rounded-full px-2 py-0.5">
                    Innovator
                  </span>
                )}
              </div>
              <ProductCardImage product={product} />
              <h3 className="font-display text-xl font-semibold">{product.title}</h3>
              <p className="text-gold text-sm mt-1">{product.tagline}</p>
              <p className="mt-3 text-sm text-muted-foreground flex-1 leading-relaxed">
                {product.description.slice(0, 160)}…
              </p>
              <ProductCardActions product={product} />
            </GlassCard>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <FlaskConical className="h-4 w-4 text-gold" />
            Early access available for testing partners
          </div>
          <Button href="/products" variant="outline">
            View all products <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
