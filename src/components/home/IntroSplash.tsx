"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { company } from "@/data/site";
import { cn } from "@/lib/utils";

export const INTRO_KEY = "techflare-intro-seen";

const titleWords = [
  { text: "TechFlare", className: "text-gold", from: { x: -48, y: 24, scale: 0.2 } },
  { text: "Solutions", className: "text-white/90", from: { x: 52, y: -28, scale: 0.2 } },
];

const taglineWords = [
  { text: "Flare", className: "text-gold font-semibold", from: { x: -36, y: 30 } },
  { text: "Up", className: "text-white/90", from: { x: 28, y: -32 } },
  { text: "the", className: "text-white/70", from: { x: -20, y: 36 } },
  { text: "Future,", className: "text-gold-light font-semibold", from: { x: 40, y: 20 } },
  { text: "with", className: "text-white/70", from: { x: -44, y: -24 } },
  { text: "Lines", className: "text-life-green font-semibold", from: { x: 32, y: 38 } },
  { text: "of", className: "text-white/70", from: { x: -16, y: -36 } },
  { text: "Codes", className: "text-gold font-semibold", from: { x: 48, y: -16 } },
];

function MaterializeWord({
  text,
  className,
  delay,
  from,
}: {
  text: string;
  className?: string;
  delay: number;
  from: { x: number; y: number; scale?: number };
}) {
  return (
    <motion.span
      className={cn("inline-block will-change-transform", className)}
      initial={{
        opacity: 0,
        x: from.x,
        y: from.y,
        scale: from.scale ?? 0.25,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {text}
    </motion.span>
  );
}

interface IntroSplashProps {
  onComplete?: () => void;
}

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      onComplete?.();
    }, 8000);

    const welcomeTimer = setTimeout(() => setShowWelcome(true), 4200);
    const exitTimer = setTimeout(() => {
      setExiting(true);
      sessionStorage.setItem(INTRO_KEY, "1");
    }, 5600);

    return () => {
      clearTimeout(safetyTimer);
      clearTimeout(welcomeTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  const titleBaseDelay = 0.6;
  const taglineBaseDelay = 2.0;
  const taglineStagger = 0.18;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (exiting) {
          setVisible(false);
          onComplete?.();
        }
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(34,197,94,0.06),transparent_40%)]" />

      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-gold/40"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
          transition={{ duration: 2, delay: 0.3 + i * 0.2, repeat: Infinity, repeatDelay: 3 }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 sm:mb-12"
        >
          <Image
            src="/logo.png"
            alt={company.name}
            width={200}
            height={200}
            priority
            className="h-24 w-auto sm:h-32 object-contain"
          />
        </motion.div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-wide uppercase flex flex-wrap justify-center items-baseline gap-x-2 gap-y-1">
          {titleWords.map((word, i) => (
            <MaterializeWord
              key={`${word.text}-${i}`}
              text={word.text}
              className={word.className}
              delay={titleBaseDelay + i * 0.35}
              from={word.from}
            />
          ))}
        </h1>

        <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl leading-relaxed flex flex-wrap justify-center items-baseline gap-x-1.5 gap-y-1 max-w-2xl mx-auto">
          {taglineWords.map((word, i) => (
            <MaterializeWord
              key={`${word.text}-${i}`}
              text={word.text}
              className={word.className}
              delay={taglineBaseDelay + i * taglineStagger}
              from={{ ...word.from, scale: 0.2 }}
            />
          ))}
        </p>

        <div className="mt-10 sm:mt-12 h-10 flex items-center justify-center">
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <motion.span
                className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-gold"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <span className="text-sm sm:text-base uppercase tracking-[0.35em] text-gold font-semibold">
                Welcome to TechFlare Solutions
              </span>
              <motion.span
                className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-life-green"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 h-px bg-gold/20 w-56 sm:w-72 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-gold via-life-green to-gold origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: showWelcome ? 1 : 0.35 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
