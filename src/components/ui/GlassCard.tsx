"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  id?: string;
}

export function GlassCard({ children, className, hover = true, delay = 0, id }: GlassCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "rounded-2xl border border-gold/15 bg-deep-blue/30 backdrop-blur-xl",
        "shadow-lg shadow-black/10 dark:shadow-black/30",
        "p-6 transition-colors",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
