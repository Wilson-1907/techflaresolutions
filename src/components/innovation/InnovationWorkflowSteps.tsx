"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  Telescope,
  ShieldCheck,
  Microscope,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { innovationWorkflow } from "@/data/site";
import { cn } from "@/lib/utils";

const stepMeta: Record<
  number,
  { icon: LucideIcon; accent: string; glow: string; ring: string }
> = {
  1: {
    icon: Lightbulb,
    accent: "from-amber-400 to-gold",
    glow: "shadow-amber-400/30",
    ring: "border-amber-400/40",
  },
  2: {
    icon: Telescope,
    accent: "from-sky-400 to-blue-600",
    glow: "shadow-sky-400/30",
    ring: "border-sky-400/40",
  },
  3: {
    icon: ShieldCheck,
    accent: "from-orange-400 to-rose-500",
    glow: "shadow-orange-400/30",
    ring: "border-orange-400/40",
  },
  4: {
    icon: Microscope,
    accent: "from-violet-400 to-purple-600",
    glow: "shadow-violet-400/30",
    ring: "border-violet-400/40",
  },
  5: {
    icon: Rocket,
    accent: "from-life-green to-emerald-600",
    glow: "shadow-life-green/30",
    ring: "border-life-green/40",
  },
};

interface InnovationWorkflowStepsProps {
  variant?: "default" | "compact";
  className?: string;
}

export function InnovationWorkflowSteps({
  variant = "default",
  className,
}: InnovationWorkflowStepsProps) {
  const compact = variant === "compact";

  return (
    <div className={cn("relative", className)}>
      {/* Desktop journey line */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px md:block"
        aria-hidden
      >
        <div className="mx-auto h-full max-w-5xl bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <motion.div
          className="absolute left-[10%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gold"
          animate={{ left: ["10%", "90%", "10%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div
        className={cn(
          "grid gap-5",
          compact ? "md:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-5"
        )}
      >
        {innovationWorkflow.map((step, i) => {
          const meta = stepMeta[step.step];
          const Icon = meta.icon;

          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              {/* Mobile vertical connector */}
              {i < innovationWorkflow.length - 1 && (
                <div
                  className="absolute left-7 top-[4.5rem] h-[calc(100%-1rem)] w-px bg-gradient-to-b from-gold/50 to-transparent md:hidden"
                  aria-hidden
                />
              )}

              <div
                className={cn(
                  "relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300",
                  "hover:border-gold/30 hover:bg-white/[0.06] hover:-translate-y-1",
                  meta.ring
                )}
              >
                <span
                  className="pointer-events-none absolute -right-2 -top-4 select-none text-7xl font-black text-white/[0.03]"
                  aria-hidden
                >
                  {step.step}
                </span>

                <div className="relative flex items-start gap-4 md:flex-col md:items-center md:text-center">
                  <div
                    className={cn(
                      "relative flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110",
                      compact ? "h-12 w-12" : "h-14 w-14",
                      meta.accent,
                      meta.glow
                    )}
                  >
                    <Icon className={cn("text-white", compact ? "h-5 w-5" : "h-6 w-6")} />
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-black/40 bg-deep-blue text-[10px] font-bold text-gold">
                      {step.step}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 md:w-full">
                    <span className="inline-block rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                      {step.phase}
                    </span>
                    <h3
                      className={cn(
                        "mt-2 font-bold leading-snug",
                        compact ? "text-sm" : "text-base sm:text-lg"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-1.5 text-muted-foreground leading-relaxed",
                        compact ? "text-xs" : "text-sm"
                      )}
                    >
                      {step.description}
                    </p>
                    {!compact && (
                      <p className="mt-3 text-xs italic text-gold/70">{step.hint}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
