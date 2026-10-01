import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { products } from "@/data/site";

export const metadata: Metadata = {
  title: "Products | Voting, Biometrics & More",
  description:
    "TechFlare Solutions products: blockchain voting, biometric attendance, examination security, and smart agriculture — order online from Kenya.",
  keywords: [
    "blockchain voting Kenya",
    "biometric attendance",
    "TechFlare Solutions products",
  ],
  alternates: { canonical: "/products" },
  openGraph: {
    title: "TechFlare Solutions Products",
    description: "Proven technology products — voting, biometrics, exam security, and more.",
    url: "/products",
  },
  robots: { index: true, follow: true },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Our Products"
        subtitle="Battle-tested solutions deployed across industries worldwide"
        badge="Products"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {products.map((product, i) => (
              <GlassCard key={product.slug} delay={i * 0.1}>
                <h2 className="text-2xl font-bold">{product.title}</h2>
                <p className="text-gold mt-1">{product.tagline}</p>
                <p className="mt-3 text-muted-foreground">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.features.map((f) => (
                    <span key={f} className="rounded-full bg-white/10 px-3 py-1 text-xs">{f}</span>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button href={`/products/${product.slug}`}>View Details</Button>
                  <Button href="/contact" variant="outline">Request Demo</Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
