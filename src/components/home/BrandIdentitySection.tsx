"use client";

import { motion } from "framer-motion";
import { brandIdentity, company } from "@/data/site";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const accentStyles = {
  gold: "border-gold/25 bg-gold/5",
  blue: "border-blue-500/25 bg-blue-500/5",
  white: "border-white/20 bg-white/5",
};

const accentText = {
  gold: "text-gold",
  blue: "text-blue-400",
  white: "text-white",
};

export function BrandIdentitySection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold text-sm font-semibold uppercase tracking-wider mb-3"
          >
            {company.name}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            {brandIdentity.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground leading-relaxed"
          >
            {brandIdentity.subtitle}
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brandIdentity.pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard
                hover={false}
                className={cn("h-full border", accentStyles[pillar.accent as keyof typeof accentStyles])}
              >
                <div className="text-3xl mb-3">{pillar.symbol}</div>
                <h3 className={cn("font-bold text-lg mb-2", accentText[pillar.accent as keyof typeof accentText])}>
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center text-sm text-muted-foreground max-w-2xl mx-auto"
        >
          {company.brandStatement}
        </motion.p>
      </div>
    </section>
  );
}
