"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { products as staticProducts, type Product } from "@/data/site";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { buildEmailComposeLink } from "@/lib/mailto";
import { ProductCardImage, ProductCardActions, ProductStatusBadge } from "@/components/products/ProductCard";
import { apiUrl } from "@/lib/api-base";

export function ProductsPreview() {
  const [products, setProducts] = useState<Product[]>(staticProducts.slice(0, 3));

  useEffect(() => {
    fetch(apiUrl("/api/catalog"))
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d) => {
        const remote = (d.products ?? []) as Product[];
        setProducts(remote.length > 0 ? remote.slice(0, 3) : staticProducts.slice(0, 3));
      })
      .catch(() => setProducts(staticProducts.slice(0, 3)));
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-transparent via-deep-blue/10 to-transparent">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">Our Products</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Built by TechFlare</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Ready platforms, products in the fire, and coming releases — plus innovator partnerships.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <GlassCard key={product.slug} delay={i * 0.1} className="h-full flex flex-col">
              <div className="mb-3 flex flex-wrap gap-2">
                <ProductStatusBadge status={product.status} />
                {product.source === "innovator" && (
                  <span className="text-xs text-life-green border border-life-green/30 rounded-full px-2 py-0.5">Innovator</span>
                )}
              </div>
              <ProductCardImage product={product} />
              <h3 className="text-xl font-bold">{product.title}</h3>
              <p className="text-gold text-sm mt-1">{product.tagline}</p>
              <p className="mt-3 text-sm text-muted-foreground flex-1">{product.description.slice(0, 140)}…</p>
              <ProductCardActions product={product} />
            </GlassCard>
          ))}

          <GlassCard delay={0.3} className="h-full flex flex-col items-center justify-center text-center border-dashed border-gold/25">
            <Sparkles className="h-10 w-10 text-gold/50 mb-4" />
            <h3 className="text-lg font-bold">More Coming Soon</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              New products across education, governance, and enterprise.
            </p>
            <Button href={buildEmailComposeLink({ type: "general", label: "Product partnership" })} variant="outline" size="sm" className="mt-4">
              Email us
            </Button>
          </GlassCard>
        </div>

        <div className="text-center mt-10">
          <Button href="/products" variant="outline">
            View All Products <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
