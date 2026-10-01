import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/services/ServiceCard";
import { services } from "@/data/site";

export const metadata: Metadata = {
  title: "Services | Software, AI & Innovation",
  description:
    "TechFlare Solutions services: innovation consulting, software development, AI solutions, data engineering, cloud, cybersecurity, R&D, and product development in Kenya.",
  keywords: [
    "software development Kenya",
    "AI solutions Kenya",
    "innovation consulting",
    "TechFlare Solutions services",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "TechFlare Solutions Services",
    description: "From research to deployment — software, AI, cloud, and innovation services.",
    url: "/services",
  },
  robots: { index: true, follow: true },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive technology services from research to deployment"
        badge="What We Offer"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, i) => (
              <div key={service.slug} id={service.slug} className="scroll-mt-28">
                <ServiceCard
                  slug={service.slug}
                  title={service.title}
                  description={service.description}
                  image={service.image}
                  delay={i * 0.05}
                  variant="wide"
                />
                <div className="mt-4 px-1">
                  <Button href="/contact" variant="ghost" size="sm">
                    Get Started →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
