"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/site";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export function ProductsPreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent via-deep-blue/10 to-transparent">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">Our Products</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Proven Solutions</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Battle-tested products deployed across education, government, agriculture, and enterprise.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product, i) => (
            <Link key={product.slug} href={`/products/${product.slug}`}>
              <GlassCard delay={i * 0.1} className="h-full cursor-pointer hover:border-gold/30">
                <h3 className="text-xl font-bold">{product.title}</h3>
                <p className="text-gold text-sm mt-1">{product.tagline}</p>
                <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.features.slice(0, 3).map((f) => (
                    <span key={f} className="rounded-full bg-white/10 px-3 py-1 text-xs">{f}</span>
                  ))}
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/products" variant="outline">
            Explore All Products <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
