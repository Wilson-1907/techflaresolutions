import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { industries, products } from "@/data/site";

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

  const relatedProducts = products.filter((p) =>
    p.slug.includes(industry.slug) ||
    (industry.slug === "education" && ["biometric-attendance", "examination-security"].includes(p.slug)) ||
    (industry.slug === "agriculture" && p.slug === "smart-agriculture") ||
    (industry.slug === "government" && p.slug === "blockchain-voting")
  );

  return (
    <>
      <PageHeader
        title={industry.title}
        subtitle={industry.description}
        badge="Industry"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-12">
          <GlassCard>
            <h2 className="text-2xl font-bold mb-4">Solutions for {industry.title}</h2>
            <p className="text-muted-foreground leading-relaxed">
              TechFlare Solutions delivers tailored technology solutions for the {industry.title.toLowerCase()} sector.
              From digital transformation to custom product development, we understand the unique challenges
              and regulatory requirements of your industry.
            </p>
            <div className="mt-6 flex gap-3">
              <Button href="/solutions">Solve My Problem</Button>
              <Button href="/contact" variant="outline">Contact Us</Button>
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
