"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { innovationWorkflow } from "@/data/site";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LiveStatCounter } from "@/components/ui/LiveStatCounter";
import { useLiveStats } from "@/components/providers/StatsProvider";

export function InnovationShowcase() {
  const stats = useLiveStats();

  const hubStats = [
    { label: "Ideas Submitted", value: stats.ideasSubmitted, suffix: "+" },
    { label: "Ideas Approved", value: stats.ideasApproved, suffix: "+" },
    { label: "Products Launched", value: stats.productsLaunched, suffix: "+" },
    { label: "Active Innovators", value: stats.activeInnovators, suffix: "+" },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-blue/20 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-gold text-sm font-semibold uppercase tracking-wider"
          >
            Our Unique Approach
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl"
          >
            The Innovation Hub
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Most companies say &ldquo;Tell us what software you want.&rdquo; We say:
            bring your problem or idea — we&apos;ll research, validate, build, and launch it.
          </motion.p>
        </div>

        <div className="grid gap-4 md:grid-cols-5 mb-12">
          {innovationWorkflow.map((step, i) => (
            <GlassCard key={step.step} delay={i * 0.1} className="relative text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-deep-blue-mid text-sm font-bold">
                {step.step}
              </div>
              <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>
              {i < innovationWorkflow.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/50" />
              )}
            </GlassCard>
          ))}
        </div>

        <GlassCard className="border-gold/30 bg-gradient-to-r from-gold/10 to-gold-dark/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Ready to innovate?</h3>
              <ul className="space-y-3 mb-6">
                {[
                  "Submit ideas, inventions, or business concepts",
                  "Track your submission through every review stage",
                  "Partner with our research and engineering teams",
                  "Turn validated ideas into market-ready products",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button href="/innovation-hub">Go to Innovation Hub</Button>
                <Button href="/portal/innovation" variant="outline">Innovator Portal</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {hubStats.map((stat) => (
                <div key={stat.label} className="rounded-xl bg-deep-blue/40 border border-gold/10 p-4 text-center">
                  <div className="text-2xl font-bold text-gold tabular-nums">
                    <LiveStatCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
