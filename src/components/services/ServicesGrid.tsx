"use client";

import { useEffect, useState } from "react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { OpenGmailButton } from "@/components/ui/OpenGmailButton";
import { services } from "@/data/site";

export function ServicesGrid() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && services.some((s) => s.slug === hash)) {
        setActiveSlug(hash);
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {services.map((service, i) => (
        <div key={service.slug} id={service.slug} className="scroll-mt-28">
          <ServiceCard
            slug={service.slug}
            title={service.title}
            description={service.description}
            image={service.image}
            approach={service.approach}
            tools={service.tools}
            delay={i * 0.05}
            variant="wide"
            expandable
            defaultExpanded={activeSlug === service.slug}
          />
          <div className="mt-4 px-1">
            <OpenGmailButton
              context={{ type: "service", service: service.title }}
              variant="primary"
              size="sm"
              showSubject
            >
              Email us about {service.title}
            </OpenGmailButton>
          </div>
        </div>
      ))}
    </div>
  );
}
