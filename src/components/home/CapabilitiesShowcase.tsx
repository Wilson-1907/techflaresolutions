"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { FloatingParticles } from "./FloatingParticles";

const capabilities = [
  {
    icon: Sparkles,
    title: "AI-Powered Innovation",
    description: "From concept validation to production AI — we prove what's possible before you commit.",
    gradient: "from-gold/30 to-transparent",
  },
  {
    icon: Zap,
    title: "Lightning Delivery",
    description: "Agile sprints, transparent milestones, and engineering that ships on time.",
    gradient: "from-life-green/20 to-transparent",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security, compliance-ready architecture, and zero-trust by design.",
    gradient: "from-blue-500/20 to-transparent",
  },
  {
    icon: Rocket,
    title: "Scale Without Limits",
    description: "Cloud-native systems built to grow from startup MVP to global enterprise.",
    gradient: "from-purple-500/20 to-transparent",
  },
];

export function CapabilitiesShowcase() {
  return (
    <section className="relative overflow-hidden py-24">
      <FloatingParticles />
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-gold">
            What We Build
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Engineering That <span className="text-gold">Speaks for Itself</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            This site is our portfolio in motion — every animation, every interaction, every pixel
            demonstrates the quality we deliver for our clients.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl border border-gold/20 bg-deep-blue/40 p-6 backdrop-blur-sm"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cap.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-gold/10 p-3">
                  <cap.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{cap.title}</h3>
                <p className="text-sm text-muted-foreground">{cap.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
