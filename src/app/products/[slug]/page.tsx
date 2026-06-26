import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProductOrderPanel } from "@/components/products/ProductOrderPanel";
import { ProductStatusBadge } from "@/components/products/ProductCard";
import { CheckCircle2, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildEmailComposeLink } from "@/lib/mailto";
import { loadProductBySlug } from "@/lib/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return { title: product.title, description: product.description };
}

function ProductHeroImage({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith("http")) {
    return (
      <div className="relative mb-8 h-64 sm:h-80 lg:h-96 overflow-hidden rounded-2xl border border-gold/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-cover object-center" />
      </div>
    );
  }

  return (
    <div className="relative mb-8 h-64 sm:h-80 lg:h-96 overflow-hidden rounded-2xl border border-gold/20">
      <Image src={src} alt={alt} fill className="object-cover object-center" priority sizes="(max-width: 1024px) 100vw, 1024px" />
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);
  if (!product) notFound();

  const isLive = product.status === "live";
  const isComingSoon = product.status === "coming-soon";
  const isInDev = product.status === "in-development";

  const defaultTerms = [
    "Built and maintained by TechFlare Solutions",
    "Pricing and deployment scoped per engagement",
    "Support, training, and customization available on request",
  ];

  const plans = product.pricing
    ? [
        {
          key: "starter",
          label: "Starter",
          price: typeof product.pricing.starter === "number" ? `$${product.pricing.starter}/mo` : String(product.pricing.starter ?? "Contact us"),
        },
        {
          key: "professional",
          label: "Professional",
          price: typeof product.pricing.professional === "number" ? `$${product.pricing.professional}/mo` : String(product.pricing.professional ?? "Contact us"),
        },
        {
          key: "enterprise",
          label: "Enterprise",
          price: String(product.pricing.enterprise ?? "Custom"),
        },
      ]
    : [];

  return (
    <>
      <PageHeader
        title={product.title}
        subtitle={product.source === "innovator" ? `Innovator product · ${product.innovatorName || "Partner"}` : product.tagline}
        badge="TechFlare Product"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6 flex justify-center gap-2 flex-wrap">
            <ProductStatusBadge status={product.status} />
            {product.source === "innovator" && (
              <span className="inline-flex items-center rounded-full border border-life-green/30 bg-life-green/10 px-3 py-1 text-xs font-semibold uppercase text-life-green">
                Innovator Shared
              </span>
            )}
          </div>

          {isLive && product.externalUrl && (
            <GlassCard className="mb-8 border-life-green/30 bg-life-green/5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-life-green">Ready — Live Now</p>
                  <p className="text-sm text-muted-foreground mt-1">This product is available to use today.</p>
                </div>
                <a
                  href={product.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-life-green/20 px-5 py-2.5 text-sm font-semibold text-life-green hover:bg-life-green/30"
                >
                  Launch product <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </GlassCard>
          )}

          {isInDev && (
            <GlassCard className="mb-8 border-gold/30">
              <p className="text-sm text-muted-foreground">
                <strong className="text-gold">In the Fire</strong> — TechFlare Solutions is actively building this product.
              </p>
            </GlassCard>
          )}

          {isComingSoon && (
            <GlassCard className="mb-8 border-white/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Coming</strong> — announced and preparing for launch.
              </p>
            </GlassCard>
          )}

          {product.image && <ProductHeroImage src={product.image} alt={product.title} />}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <GlassCard>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </GlassCard>

              {product.howItWorks && (
                <GlassCard>
                  <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                  <ol className="space-y-3">
                    {product.howItWorks.map((step, i) => (
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
              {isLive && product.externalUrl ? (
                <GlassCard className="border-life-green/30">
                  <h2 className="text-xl font-bold mb-4">Get Started</h2>
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold/20 py-3 text-sm font-semibold text-gold hover:bg-gold/30"
                  >
                    Launch product <ExternalLink className="h-4 w-4" />
                  </a>
                </GlassCard>
              ) : isInDev || isComingSoon ? (
                <GlassCard className="border-gold/30">
                  <h2 className="text-xl font-bold mb-4">{isInDev ? "Early Access" : "Join Waitlist"}</h2>
                  <Button href={buildEmailComposeLink({ type: "product", product: product.title })} className="w-full">
                    <Mail className="h-4 w-4" /> Email us — {product.title}
                  </Button>
                  <Link href="/products" className="mt-3 block text-center text-sm text-gold hover:underline">
                    ← All products
                  </Link>
                </GlassCard>
              ) : product.pricing && plans.length > 0 ? (
                <>
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
                    terms={defaultTerms}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
