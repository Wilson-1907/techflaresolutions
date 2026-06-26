import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { industries } from "@/data/site";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Technology solutions for every industry — e-commerce, SaaS, fintech, healthcare, education, government, manufacturing, and more.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        title="Industries We Serve"
        subtitle="Technology, e-commerce, fintech, healthcare, government, manufacturing — and every sector in between"
        badge="Sectors"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            TechFlare Solutions builds enterprise software and digital products across {industries.length} industries —
            from technology and e-commerce to agriculture, energy, and public sector.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {industries.map((industry, i) => (
              <Link key={industry.slug} href={`/industries/${industry.slug}`}>
                <GlassCard delay={i * 0.05} className="h-full cursor-pointer hover:border-gold/30 overflow-hidden p-0">
                  <div className="relative h-44 w-full">
                    <Image
                      src={industry.image}
                      alt={industry.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <h2 className="absolute bottom-4 left-4 text-xl font-bold text-white">{industry.title}</h2>
                  </div>
                  <p className="p-4 text-muted-foreground">{industry.description}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
