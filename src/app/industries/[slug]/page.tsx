import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { industries, products } from "@/data/site";
import { buildEmailComposeLink } from "@/lib/mailto";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return { title: "Industry Not Found" };
  return { title: industry.title, description: industry.description };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();

  const relatedProducts = products.filter((p) => {
    const byIndustry: Record<string, string[]> = {
      education: ["career-compass-cbe", "biometric-class-attendance"],
      government: ["biometric-voting-system"],
      "ecommerce-retail": ["career-compass-cbe"],
      technology: ["career-compass-cbe", "biometric-voting-system"],
    };
    return (byIndustry[industry.slug] || []).includes(p.slug);
  });

  return (
    <>
      <PageHeader
        title={industry.title}
        subtitle={industry.description}
        badge="Industry"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-12">
          <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden border border-gold/20">
            <Image
              src={industry.image}
              alt={industry.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-gold text-sm font-semibold uppercase tracking-wider mb-1">Industry</p>
              <h2 className="text-3xl font-bold text-white">{industry.title}</h2>
            </div>
          </div>

          <GlassCard>
            <h2 className="text-2xl font-bold mb-4">Solutions for {industry.title}</h2>
            <p className="text-muted-foreground leading-relaxed">
              TechFlare Solutions delivers tailored technology solutions for the {industry.title.toLowerCase()} sector.
              From digital transformation to custom product development, we understand the unique challenges
              and regulatory requirements of your industry.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/solutions">Solve My Problem</Button>
              <Button href={buildEmailComposeLink({ type: "industry", industry: industry.title })} variant="outline">
                Email us
              </Button>
            </div>
          </GlassCard>

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {relatedProducts.map((product) => (
                  <GlassCard key={product.slug}>
                    <h3 className="font-bold">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.tagline}</p>
                    <Button href={`/products/${product.slug}`} variant="ghost" size="sm" className="mt-3">
                      Learn More →
                    </Button>
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
