"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Layers } from "lucide-react";
import { company } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { GlobeAnimation } from "./GlobeAnimation";

interface HeroSectionProps {
  ready?: boolean;
}

export function HeroSection({ ready = true }: HeroSectionProps) {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 mesh-bg pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-60 pointer-events-none" />
      <GlobeAnimation />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease, delay: ready ? 0.05 : 0 }}
            className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300/90"
          >
            {company.name}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, ease, delay: ready ? 0.15 : 0 }}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Technology that turns
            <span className="gradient-text"> ideas </span>
            into working systems.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease, delay: ready ? 0.3 : 0 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Research, software, AI, and automation — engineered with elegance for schools,
            enterprises, and innovators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease, delay: ready ? 0.42 : 0 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button href="/services" size="lg">
              <Layers className="h-5 w-5" />
              Explore services
            </Button>
            <Button href="/products" variant="outline" size="lg">
              View products
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/login?redirect=/portal/innovation/submit" variant="secondary" size="lg">
              <Lightbulb className="h-5 w-5" />
              Submit an idea
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
