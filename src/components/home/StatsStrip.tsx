"use client";

import { motion } from "framer-motion";
import { LiveStatCounter } from "@/components/ui/LiveStatCounter";
import { useLiveStats } from "@/components/providers/StatsProvider";

export function StatsStrip() {
  const stats = useLiveStats();
  const items = [
    { value: stats.projectsDelivered, suffix: "+", label: "Projects delivered" },
    { value: stats.industriesServed, suffix: "+", label: "Industries served" },
    { value: stats.ideasValidated, suffix: "+", label: "Ideas validated" },
    { value: stats.clientSatisfaction, suffix: "%", label: "Client satisfaction", decimals: 1 },
  ];

  return (
    <section className="relative py-16 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-5 text-center backdrop-blur-sm"
            >
              <div className="font-display text-2xl font-semibold text-gold tabular-nums sm:text-3xl">
                <LiveStatCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </div>
              <div className="mt-1 text-xs text-muted-foreground tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
