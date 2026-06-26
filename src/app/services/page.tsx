import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { ServiceCatalogPricing } from "@/components/services/ServiceCatalogPricing";

export const metadata: Metadata = {
  title: "Services",
  description: "Innovation consulting, software development, AI solutions, cloud, cybersecurity, and more.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Tap any service card to see how we solve it — our process, tools, and delivery approach"
        badge="What We Offer"
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
