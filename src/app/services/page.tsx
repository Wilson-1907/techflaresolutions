import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { ServiceCatalogPricing } from "@/components/services/ServiceCatalogPricing";

export const metadata: Metadata = {
  title: "Services — Technology, Research, Software, AI & Automation",
  description:
    "Full TechFlare Solutions service line: innovation consulting, software development, AI, automation, data, cloud, IoT, cybersecurity, research, and product development in Kenya.",
  keywords: [
    "technology",
    "research",
    "software",
    "AI",
    "idea",
    "automation",
    "software development Kenya",
    "cybersecurity",
    "IoT",
    "cloud",
    "simple frontend",
    "POS",
  ],
  alternates: { canonical: "/services" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Services | TechFlare Solutions",
    description: "Technology, research, software, AI, ideas, and automation services.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Nine complete service lines — from research and consulting to software, AI, automation, and secure deployment"
        badge="What we offer"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ServicesGrid />
          <ServiceCatalogPricing />
        </div>
      </section>
    </>
  );
}
