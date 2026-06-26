"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility,
  Type,
  Volume2,
  VolumeX,
  Contrast,
  Minus,
  Plus,
  RotateCcw,
  Link2,
  MousePointerClick,
  BookOpen,
  X,
} from "lucide-react";
import { useAccessibility } from "./AccessibilityProvider";
import { getPathAnnouncement, readPageSummary } from "@/lib/accessibility-path-labels";
import { speak, waitForVoices, isSpeechSupported } from "@/lib/speech-guide";
import { company } from "@/data/site";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  icon: typeof Volume2;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
      <span
        className={`mt-1 h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${checked ? "bg-life-green" : "bg-white/20"}`}
        aria-hidden
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </span>
    </button>
  );
}

export function AccessibilityToolbar() {
  const {
    settings,
    panelOpen,
    setPanelOpen,
    togglePanel,
    increaseFont,
    decreaseFont,
    resetFont,
    toggleAudioGuide,
    toggleHighContrast,
    toggleReduceMotion,
    toggleHighlightLinks,
    toggleLargerTargets,
    resetAll,
    announce,
  } = useAccessibility();

  const pathname = usePathname();
  const fontPercent = Math.round(settings.fontScale * 100);

  useEffect(() => {
    if (!settings.audioGuide) return;
    const msg = getPathAnnouncement(pathname);
    let cancelled = false;
    const timer = setTimeout(() => {
      void waitForVoices().then(() => {
        if (!cancelled) speak(msg, { interrupt: true });
      });
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pathname, settings.audioGuide]);

  function readPage() {
    const summary = readPageSummary();
    void waitForVoices().then(() => speak(summary, { interrupt: true }));
  }

  function handleIncreaseFont() {
    increaseFont();
    announce("Text size increased", true);
  }

  function handleDecreaseFont() {
    decreaseFont();
    announce("Text size decreased", true);
  }

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <div
        id="a11y-live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <AnimatePresence>
        {!panelOpen && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            type="button"
            onClick={togglePanel}
            className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-life-green/40 bg-gradient-to-br from-deep-blue to-deep-blue-mid text-white shadow-xl shadow-black/40 hover:border-life-green/70"
            aria-label="Open accessibility options. Keyboard shortcut Alt plus A."
            aria-expanded={panelOpen}
            aria-controls="accessibility-panel"
          >
            <Accessibility className="h-7 w-7 text-life-green" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panelOpen && (
          <motion.aside
            id="accessibility-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed bottom-6 left-6 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-life-green/30 bg-background/98 shadow-2xl backdrop-blur-xl"
            aria-label="Accessibility options"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-life-green/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-life-green" aria-hidden />
                <div>
                  <h2 className="text-sm font-bold leading-tight">Accessibility</h2>
                  <p className="text-[11px] text-muted-foreground">For everyone · Alt+A</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/10"
                aria-label="Close accessibility panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[min(70vh,520px)] space-y-4 overflow-y-auto p-4">
              <section aria-labelledby="a11y-font-heading">
                <h3 id="a11y-font-heading" className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
                  <Type className="h-4 w-4" aria-hidden />
                  Text size
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDecreaseFont}
                    disabled={settings.fontScale <= 0.875}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold hover:bg-white/10 disabled:opacity-40"
                    aria-label="Decrease text size"
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                    A−
                  </button>
                  <span className="min-w-[4rem] text-center text-sm font-bold text-gold" aria-live="polite">
                    {fontPercent}%
                  </span>
                  <button
                    type="button"
                    onClick={handleIncreaseFont}
                    disabled={settings.fontScale >= 2}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold hover:bg-white/10 disabled:opacity-40"
                    aria-label="Increase text size"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                    A+
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetFont();
                    announce("Text size reset to default", true);
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  Reset text size
                </button>
              </section>

              <section aria-labelledby="a11y-audio-heading" className="space-y-2">
                <h3 id="a11y-audio-heading" className="text-xs font-semibold uppercase tracking-wide text-gold">
                  Audio personal assistant
                </h3>
                <ToggleRow
                  label="Audio guide"
                  description="Speaks page names, buttons, and links as you explore — helpful if you use a screen reader or cannot see the screen."
                  checked={settings.audioGuide}
                  onChange={toggleAudioGuide}
                  icon={settings.audioGuide ? Volume2 : VolumeX}
                />
                <button
                  type="button"
                  onClick={readPage}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/30 bg-gold/10 py-3 text-sm font-semibold text-gold hover:bg-gold/20"
                >
                  <BookOpen className="h-4 w-4" aria-hidden />
                  Read this page aloud
                </button>
                {!isSpeechSupported() && (
                  <p className="text-xs text-amber-400/90">
                    Your browser does not support spoken guidance. Text announcements still appear for screen readers.
                  </p>
                )}
              </section>

              <section aria-labelledby="a11y-visual-heading" className="space-y-2">
                <h3 id="a11y-visual-heading" className="text-xs font-semibold uppercase tracking-wide text-gold">
                  Visual comfort
                </h3>
                <ToggleRow
                  label="High contrast"
                  description="Stronger text and link colours for easier reading."
                  checked={settings.highContrast}
                  onChange={toggleHighContrast}
                  icon={Contrast}
                />
                <ToggleRow
                  label="Highlight links"
                  description="Underline links across the site."
                  checked={settings.highlightLinks}
                  onChange={toggleHighlightLinks}
                  icon={Link2}
                />
                <ToggleRow
                  label="Larger click targets"
                  description="Bigger buttons and links for easier tapping."
                  checked={settings.largerTargets}
                  onChange={toggleLargerTargets}
                  icon={MousePointerClick}
                />
                <ToggleRow
                  label="Reduce motion"
                  description="Minimise animations and smooth scrolling."
                  checked={settings.reduceMotion}
                  onChange={toggleReduceMotion}
                  icon={RotateCcw}
                />
              </section>

              <button
                type="button"
                onClick={() => {
                  resetAll();
                  speak("All accessibility settings reset.", { interrupt: true });
                }}
                className="w-full rounded-xl border border-white/10 py-2.5 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                Reset all settings
              </button>

              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Need human help? Email {company.email} or call {company.phone}. Full details on our{" "}
                <a href="/accessibility" className="text-gold underline">
                  accessibility page
                </a>
                .
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
