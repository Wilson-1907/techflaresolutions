"use client";

import { ArrowRight } from "lucide-react";
import { services } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/services/ServiceCard";

export function ServicesPreview() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-cyan-300/90 text-sm font-semibold uppercase tracking-[0.22em]">
              Services
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-5xl tracking-tight">
              Full-stack technology delivery
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Innovation consulting, software, AI, data, cloud, IoT, cybersecurity, R&amp;D, and
              product development — our complete service line, not a trimmed catalog.
            </p>
          </div>
          <Button href="/services" variant="outline">
            All services <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard
              key={service.slug}
              slug={service.slug}
              title={service.title}
              description={service.description}
              image={service.image}
              delay={i * 0.04}
              href={`/services#${service.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
