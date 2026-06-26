export type AccessibilitySettings = {
  fontScale: number;
  highContrast: boolean;
  reduceMotion: boolean;
  audioGuide: boolean;
  largerTargets: boolean;
  underlineLinks: boolean;
};

export const STORAGE_KEY = "techflare-a11y-settings";

export const FONT_SCALE_MIN = 0.875;
export const FONT_SCALE_MAX = 2;
export const FONT_SCALE_STEP = 0.125;
export const FONT_SCALE_DEFAULT = 1;

export const defaultSettings: AccessibilitySettings = {
  fontScale: FONT_SCALE_DEFAULT,
  highContrast: false,
  reduceMotion: false,
  audioGuide: false,
  largerTargets: false,
  underlineLinks: false,
};

export function clampFontScale(value: number): number {
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Math.round(value / FONT_SCALE_STEP) * FONT_SCALE_STEP));
}

export function loadSettings(): AccessibilitySettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
    return {
      ...defaultSettings,
      ...parsed,
      fontScale: clampFontScale(parsed.fontScale ?? FONT_SCALE_DEFAULT),
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AccessibilitySettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore quota errors
  }
}

export function applySettingsToDocument(settings: AccessibilitySettings): void {
  const root = document.documentElement;
  root.style.setProperty("--a11y-font-scale", String(settings.fontScale));
  root.classList.toggle("a11y-high-contrast", settings.highContrast);
  root.classList.toggle("a11y-reduce-motion", settings.reduceMotion);
  root.classList.toggle("a11y-larger-targets", settings.largerTargets);
  root.classList.toggle("a11y-underline-links", settings.underlineLinks);
  root.dataset.a11yAudio = settings.audioGuide ? "on" : "off";
}
