"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { parseJsonResponse } from "@/lib/parse-json";

type CatalogService = {
  id: string;
  name: string;
  category: string;
  description: string;
  limits: string;
  unit: string;
  typicalTimeline: string;
};

export function ServiceCatalogPricing() {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/services/catalog")
      .then((r) => parseJsonResponse<{ services?: CatalogService[]; error?: string }>(r))
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setServices(d.services || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load catalog"));
  }, []);

  if (error) return null;
  if (services.length === 0) return null;

  return (
    <section id="catalog" className="scroll-mt-28 mt-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Service catalog</h2>
        <p className="text-muted-foreground text-sm max-w-3xl">
          What we deliver, typical timelines, and scope limits. Project pricing is prepared individually after
          scoping — contact us or use your client portal for a formal quote.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <GlassCard key={s.id} className="text-sm">
            <p className="text-xs text-gold uppercase tracking-wide mb-1">{s.category}</p>
            <h3 className="font-bold text-base mb-1">{s.name}</h3>
            <p className="text-muted-foreground mb-2">{s.description}</p>
            <p className="text-xs text-muted-foreground mb-3">
              <strong className="text-foreground">Limits:</strong> {s.limits}
            </p>
            <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 pt-3 text-muted-foreground">
              <span>Typical timeline: {s.typicalTimeline}</span>
              <span className="text-xs">Quote on request</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
