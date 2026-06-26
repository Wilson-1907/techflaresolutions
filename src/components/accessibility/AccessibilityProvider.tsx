"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { primeSpeechVoices, speak, speakToLiveRegion, stopSpeaking, waitForVoices } from "@/lib/speech-guide";

const STORAGE_KEY = "techflare-a11y";
const FONT_STEPS = [0.875, 1, 1.125, 1.25, 1.375, 1.5, 1.75, 2] as const;

export type AccessibilitySettings = {
  fontScale: number;
  audioGuide: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  highlightLinks: boolean;
  largerTargets: boolean;
};

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontScale: 1,
  audioGuide: false,
  highContrast: false,
  reduceMotion: false,
  highlightLinks: false,
  largerTargets: false,
};

type AccessibilityContextValue = {
  settings: AccessibilitySettings;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
  toggleAudioGuide: () => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleHighlightLinks: () => void;
  toggleLargerTargets: () => void;
  resetAll: () => void;
  announce: (message: string, interrupt?: boolean) => void;
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function loadSettings(): AccessibilitySettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      fontScale: FONT_STEPS.includes(parsed.fontScale as (typeof FONT_STEPS)[number])
        ? (parsed.fontScale as number)
        : 1,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function applySettingsToDocument(settings: AccessibilitySettings) {
  const root = document.documentElement;
  root.style.setProperty("--a11y-font-scale", String(settings.fontScale));
  root.classList.toggle("a11y-high-contrast", settings.highContrast);
  root.classList.toggle("a11y-reduce-motion", settings.reduceMotion);
  root.classList.toggle("a11y-highlight-links", settings.highlightLinks);
  root.classList.toggle("a11y-large-targets", settings.largerTargets);
  root.classList.toggle("a11y-audio-guide", settings.audioGuide);
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    applySettingsToDocument(loaded);
    primeSpeechVoices();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applySettingsToDocument(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const announce = useCallback((message: string, interrupt = false) => {
    speakToLiveRegion(message);
    if (!settings.audioGuide) return;
    speak(message, { interrupt });
  }, [settings.audioGuide]);

  const update = useCallback((patch: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const stepFont = useCallback((direction: 1 | -1) => {
    setSettings((prev) => {
      const idx = FONT_STEPS.indexOf(prev.fontScale as (typeof FONT_STEPS)[number]);
      const current = idx === -1 ? FONT_STEPS.indexOf(1) : idx;
      const next = Math.max(0, Math.min(FONT_STEPS.length - 1, current + direction));
      return { ...prev, fontScale: FONT_STEPS[next] };
    });
  }, []);

  const increaseFont = useCallback(() => stepFont(1), [stepFont]);
  const decreaseFont = useCallback(() => stepFont(-1), [stepFont]);
  const resetFont = useCallback(() => update({ fontScale: 1 }), [update]);

  const toggleAudioGuide = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.audioGuide;
      if (!next) {
        stopSpeaking();
        speakToLiveRegion("Audio guide off.");
      } else {
        void waitForVoices().then(() => {
          speak(
            "Audio guide is on. I will announce each page and read buttons and links as you tap or tab. Press Alt plus A to open this panel. Tap Read this page for a short summary.",
            { interrupt: true }
          );
        });
      }
      return { ...prev, audioGuide: next };
    });
  }, []);

  const toggleHighContrast = useCallback(
    () => setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast })),
    []
  );
  const toggleReduceMotion = useCallback(
    () => setSettings((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion })),
    []
  );
  const toggleHighlightLinks = useCallback(
    () => setSettings((prev) => ({ ...prev, highlightLinks: !prev.highlightLinks })),
    []
  );
  const toggleLargerTargets = useCallback(
    () => setSettings((prev) => ({ ...prev, largerTargets: !prev.largerTargets })),
    []
  );

  const resetAll = useCallback(() => {
    stopSpeaking();
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const togglePanel = useCallback(() => setPanelOpen((v) => !v), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        togglePanel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePanel]);

  const value = useMemo(
    () => ({
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
    }),
    [
      settings,
      panelOpen,
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
    ]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
