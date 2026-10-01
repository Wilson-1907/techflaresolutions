import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { company, coreValues, leadership } from "@/data/site";

export const metadata: Metadata = {
  title: "About TechFlare Solutions",
  description:
    "Learn about TechFlare Solutions — our mission, vision, values, and leadership. Innovation, research, and engineering company based in Kenya (Karatina & Nyeri).",
  keywords: [
    "About TechFlare Solutions",
    "technology company Kenya",
    "software innovation Kenya",
    "TechFlare Solutions mission",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About TechFlare Solutions",
    description:
      "Mission, vision, and values of TechFlare Solutions — transforming ideas into world-class technology solutions.",
    url: "/about",
    type: "website",
  },
  robots: { index: true, follow: true },
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
              TechFlare Solutions was founded to close this gap. We combine rigorous research methodology, world-class engineering,
              and a genuine passion for innovation to transform ideas into solutions that matter. We don&apos;t just build software —
              we partner with visionaries to change industries. Based in Kenya with offices in Karatina and Nyeri, we serve clients
              across Africa and beyond.
            </p>
          </GlassCard>

          <div>
            <h2 className="text-2xl font-bold mb-8 text-center">Leadership</h2>
            <div className="max-w-2xl mx-auto">
              {leadership.map((leader, i) => (
                <GlassCard key={leader.name} delay={i * 0.1} className="text-center">
                  <h3 className="font-semibold text-xl">{leader.name}</h3>
                  <p className="text-gold text-sm mt-1">{leader.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{leader.bio}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
