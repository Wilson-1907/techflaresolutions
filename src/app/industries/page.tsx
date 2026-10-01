import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { industries } from "@/data/site";

export const metadata: Metadata = {
  title: "Industries",
  description: "Technology solutions for education, healthcare, agriculture, government, finance, and more.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        title="Industries We Serve"
        subtitle="Tailored technology solutions across diverse sectors"
        badge="Sectors"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, i) => (
              <Link key={industry.slug} href={`/industries/${industry.slug}`}>
                <GlassCard delay={i * 0.05} className="h-full cursor-pointer hover:border-gold/30">
                  <span className="text-4xl">{industry.icon}</span>
                  <h2 className="mt-4 text-xl font-bold">{industry.title}</h2>
                  <p className="mt-2 text-muted-foreground">{industry.description}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
