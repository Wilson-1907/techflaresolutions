import Image from "next/image";
import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { company, coreValues, founder } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about TechFlare Solutions — our mission, vision, values, and founder.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About TechFlare Solutions"
        subtitle="Pioneering the future of innovation and technology"
        badge="Who We Are"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-16">
          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard>
              <h2 className="text-2xl font-bold mb-4 text-gold">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">{company.mission}</p>
            </GlassCard>
            <GlassCard>
              <h2 className="text-2xl font-bold mb-4 text-gold">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">{company.vision}</p>
            </GlassCard>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-8 text-center">Core Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreValues.map((value, i) => (
                <GlassCard key={value.title} delay={i * 0.05}>
                  <h3 className="font-semibold text-lg">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <GlassCard>
            <h2 className="text-2xl font-bold mb-4">Why TechFlare Solutions Exists</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The world is full of brilliant ideas that never see the light of day. Entrepreneurs struggle to validate concepts.
              Enterprises face problems without clear solutions. Researchers lack the engineering capacity to commercialize discoveries.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              TechFlare Solutions was founded on {company.founded} by {founder.name} to close this gap. We combine rigorous research methodology, world-class engineering,
              and a genuine passion for innovation to transform ideas into solutions that matter. We don&apos;t just build software —
              we partner with visionaries to change industries.
            </p>
          </GlassCard>

          <div>
            <h2 className="text-2xl font-bold mb-8 text-center">Founder</h2>
            <GlassCard className="max-w-md mx-auto text-center">
              <div className="relative mx-auto h-48 w-40 overflow-hidden rounded-2xl border-2 border-gold/30">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover object-top"
                  sizes="160px"
                />
              </div>
              <h3 className="mt-5 text-xl font-bold">{founder.name}</h3>
              <p className="text-gold text-sm mt-1">{founder.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{founder.bio}</p>
            </GlassCard>
          </div>
        </div>
      </section>
    </>
  );
}
