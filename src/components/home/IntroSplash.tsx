"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { company } from "@/data/site";

export const INTRO_KEY = "techflare-intro-seen";

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
    }, 6000);

    const welcomeTimer = setTimeout(() => setShowWelcome(true), 2200);
    const exitTimer = setTimeout(() => {
      setExiting(true);
      sessionStorage.setItem(INTRO_KEY, "1");
    }, 3800);

    return () => {
      clearTimeout(safetyTimer);
      clearTimeout(welcomeTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (exiting) {
          setVisible(false);
          onComplete?.();
        }
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1),transparent_55%)]" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/logo.png"
            alt={`${company.name} — ${company.tagline}`}
            width={120}
            height={40}
            priority
            unoptimized
            className="h-10 w-auto object-contain bg-transparent"
          />
        </motion.div>

        <div className="mt-8 h-8 flex items-center justify-center">
          {showWelcome && (
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm uppercase tracking-[0.35em] text-gold font-semibold"
            >
              Welcome
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
