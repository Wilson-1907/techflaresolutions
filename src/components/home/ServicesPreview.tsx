"use client";

import { ArrowRight } from "lucide-react";
import { services } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/services/ServiceCard";

export function ServicesPreview() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-gold text-sm font-semibold uppercase tracking-wider">What We Do</span>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Our Services</h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              End-to-end technology services from research and consulting to deployment and support.
              Open any card on the services page to see how we solve it.
            </p>
          </div>
          <Button href="/services" variant="outline" className="mt-4 md:mt-0">
            View All Services <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <ServiceCard
              key={service.slug}
              slug={service.slug}
              title={service.title}
              description={service.description}
              image={service.image}
              delay={i * 0.05}
              href={`/services#${service.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
