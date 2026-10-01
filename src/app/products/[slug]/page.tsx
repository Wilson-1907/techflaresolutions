import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProductOrderPanel } from "@/components/products/ProductOrderPanel";
import { products } from "@/data/site";
import { CheckCircle2 } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };
  return { title: product.title, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const howItWorks = "howItWorks" in product ? (product as { howItWorks?: string[] }).howItWorks : undefined;
  const terms = "terms" in product ? (product as { terms?: string[] }).terms : [
    "Standard TechFlare Solutions service agreement applies",
    "Pricing subject to scope and deployment requirements",
    "Support and training packages available on request",
  ];

  const plans = [
    {
      key: "starter",
      label: "Starter",
      price: typeof product.pricing.starter === "number" ? `$${product.pricing.starter}/mo` : String(product.pricing.starter),
    },
    {
      key: "professional",
      label: "Professional",
      price: typeof product.pricing.professional === "number" ? `$${product.pricing.professional}/mo` : String(product.pricing.professional),
    },
    {
      key: "enterprise",
      label: "Enterprise",
      price: String(product.pricing.enterprise),
    },
  ];

  return (
    <>
      <PageHeader title={product.title} subtitle={product.tagline} badge="Built-in Product" />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <GlassCard className="mb-8 border-gold/20">
            <p className="text-sm text-muted-foreground">
              This is a TechFlare Solutions built-in product — browse details, pricing, and terms freely. Order without signing in; we&apos;ll help you email your request to our solutions team.
            </p>
          </GlassCard>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <GlassCard>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </GlassCard>

              {howItWorks && (
                <GlassCard>
                  <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                  <ol className="space-y-3">
                    {howItWorks.map((step, i) => (
                      <li key={step} className="flex gap-3 text-muted-foreground">
                        <span className="text-gold font-bold">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </GlassCard>
              )}

              <GlassCard>
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard className="border-gold/30">
                <h2 className="text-xl font-bold mb-4">Pricing</h2>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.key} className={`rounded-xl bg-white/5 p-4 ${plan.key === "professional" ? "border border-gold/30" : ""}`}>
                      <h3 className="font-semibold">{plan.label}</h3>
                      <p className="text-2xl font-bold text-gold mt-1">{plan.price}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <ProductOrderPanel
                productSlug={product.slug}
                productTitle={product.title}
                plans={plans}
                terms={terms}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
