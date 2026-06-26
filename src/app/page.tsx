"use client";

import { useCallback } from "react";
import { IntroSplash, INTRO_KEY } from "@/components/home/IntroSplash";
import { HeroSection } from "@/components/home/HeroSection";
import { InnovationShowcase } from "@/components/home/InnovationShowcase";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ProductsPreview } from "@/components/home/ProductsPreview";
import { CTASection } from "@/components/home/CTASection";
import { AccountWhySection } from "@/components/auth/AccountWhySection";
import { AnimatedMarquee } from "@/components/home/AnimatedMarquee";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsPreviewSection } from "@/components/home/NewsPreviewSection";
import { RevealUp } from "@/components/ui/RevealUp";
import { cn } from "@/lib/utils";
import { useClientReady, useIntroSeen } from "@/lib/use-client-ready";
import { useState } from "react";

export default function HomePage() {
  const ready = useClientReady();
  const introSeen = useIntroSeen(INTRO_KEY);
  const [introDone, setIntroDone] = useState(introSeen);

  const showIntro = ready && !introSeen && !introDone;
  const landingReady = !ready ? false : introSeen || introDone;

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-black" aria-hidden />;
  }

  return (
    <>
      {showIntro ? <IntroSplash onComplete={handleIntroComplete} /> : null}

      <div className={cn(!landingReady && "invisible")}>
        <HeroSection ready={landingReady} />
        <AnimatedMarquee />
        <RevealUp>
          <InnovationShowcase />
        </RevealUp>
        <RevealUp delay={0.1}>
          <ServicesPreview />
        </RevealUp>
        <RevealUp delay={0.12}>
          <ProductsPreview />
        </RevealUp>
        <RevealUp delay={0.13}>
          <NewsPreviewSection />
        </RevealUp>
        <RevealUp delay={0.14}>
          <TestimonialsSection />
        </RevealUp>
        <RevealUp delay={0.18}>
          <AccountWhySection />
        </RevealUp>
        <RevealUp delay={0.2}>
          <CTASection />
        </RevealUp>
      </div>
    </>
  );
}
