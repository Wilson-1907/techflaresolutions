"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Wrench, Compass } from "lucide-react";
import { company } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { GlobeAnimation } from "./GlobeAnimation";
import { LiveStatCounter } from "@/components/ui/LiveStatCounter";
import { useLiveStats } from "@/components/providers/StatsProvider";

interface HeroSectionProps {
  ready?: boolean;
}

export function HeroSection({ ready = true }: HeroSectionProps) {
  const stats = useLiveStats();

  const statItems = [
    { value: stats.projectsDelivered, suffix: "+", label: "Projects Delivered" },
    { value: stats.industriesServed, suffix: "+", label: "Industries Served" },
    { value: stats.ideasValidated, suffix: "+", label: "Ideas Validated" },
    { value: stats.clientSatisfaction, suffix: "%", label: "Client Satisfaction", decimals: 1 },
  ];

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <GlobeAnimation />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1, ease, delay: ready ? 0.1 : 0 }}
          >
            <span className="mb-3 block text-sm font-semibold uppercase tracking-widest text-white/70">
              {company.name}
            </span>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-deep-blue/60 px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-2 w-2 animate-pulse rounded-full bg-life-green" />
              {company.tagline}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
            transition={{ duration: 1, ease, delay: ready ? 0.25 : 0 }}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl"
          >
            {company.tagline.split(" ").map((word, i) => (
              <span key={i}>
                {word === "INNOVATIONS," || word === "SOLUTIONS" ? (
                  <span className="bg-gradient-to-r from-gold-light to-gold-dark bg-clip-text text-transparent">
                    {word}{" "}
                  </span>
                ) : (
                  `${word} `
                )}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.9, ease, delay: ready ? 0.4 : 0 }}
            className="mt-6 text-lg text-muted-foreground/80 max-w-2xl"
          >
            Bring us your problem or idea — {company.name} researches it, validates it, builds it,
            and helps turn it into a successful solution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.9, ease, delay: ready ? 0.55 : 0 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button href="/login?redirect=/portal/innovation/submit" size="lg">
              <Lightbulb className="h-5 w-5" />
              Submit an idea
            </Button>
            <Button href="/solutions" variant="secondary" size="lg">
              <Wrench className="h-5 w-5" />
              Solve my problem
            </Button>
            <Button href="/products" variant="outline" size="lg">
              <Compass className="h-5 w-5" />
              Explore Solutions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
            transition={{ delay: ready ? 0.7 : 0, duration: 1, ease }}
          className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gold/20 bg-deep-blue/40 p-4 text-center backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-gold tabular-nums">
                {ready && (
                  <LiveStatCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                  />
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
