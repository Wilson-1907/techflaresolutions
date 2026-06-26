"use client";

type SpeakOptions = {
  interrupt?: boolean;
  rate?: number;
  pitch?: number;
};

let preferredVoice: SpeechSynthesisVoice | null = null;
let voicesPromise: Promise<void> | null = null;
let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const english =
    voices.find((v) => v.lang.startsWith("en") && /google|microsoft|zira|david|samantha|daniel|mark|aria/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];

  return english ?? null;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  stopKeepAlive();
}

function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

/** Chrome/Edge often return no voices until voiceschanged fires. */
export function waitForVoices(timeoutMs = 4000): Promise<void> {
  if (!isSpeechSupported()) return Promise.resolve();

  const synth = window.speechSynthesis;
  const ready = () => synth.getVoices().length > 0;

  if (ready()) {
    preferredVoice = pickVoice();
    return Promise.resolve();
  }

  if (voicesPromise) return voicesPromise;

  const promise = new Promise<void>((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      preferredVoice = pickVoice();
      synth.removeEventListener("voiceschanged", onChange);
      resolve(undefined);
    };

    const onChange = () => {
      if (ready()) finish();
    };

    synth.addEventListener("voiceschanged", onChange);
    synth.getVoices();

    const poll = window.setInterval(() => {
      if (ready()) {
        window.clearInterval(poll);
        finish();
      }
    }, 100);

    window.setTimeout(() => {
      window.clearInterval(poll);
      finish();
    }, timeoutMs);
  });

  voicesPromise = promise.finally(() => {
    voicesPromise = null;
  });

  return voicesPromise;
}

function startKeepAlive() {
  if (keepAliveInterval || !isSpeechSupported()) return;

  keepAliveInterval = setInterval(() => {
    const synth = window.speechSynthesis;
    if (!synth.speaking) {
      stopKeepAlive();
      return;
    }
    if (synth.paused) synth.resume();
  }, 120);
}

export function speakToLiveRegion(message: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById("a11y-live-region");
  if (!el) return;
  el.textContent = "";
  requestAnimationFrame(() => {
    el.textContent = message;
  });
}

function speakNow(text: string, options: SpeakOptions = {}): void {
  if (!isSpeechSupported()) return;

  const synth = window.speechSynthesis;
  const trimmed = text.trim();
  if (!trimmed) return;

  speakToLiveRegion(trimmed);

  if (options.interrupt) synth.cancel();

  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.rate = options.rate ?? 0.95;
  utterance.pitch = options.pitch ?? 1;
  utterance.lang = preferredVoice?.lang ?? "en-US";

  if (preferredVoice) utterance.voice = preferredVoice;

  utterance.onend = () => {
    if (!synth.speaking) stopKeepAlive();
  };
  utterance.onerror = () => {
    if (!synth.speaking) stopKeepAlive();
  };

  synth.speak(utterance);
  startKeepAlive();

  if (synth.paused) synth.resume();
}

export function speak(text: string, options: SpeakOptions = {}): void {
  if (!text.trim()) return;

  if (!isSpeechSupported()) {
    speakToLiveRegion(text.trim());
    return;
  }

  void waitForVoices().then(() => speakNow(text, options));
}

export function primeSpeechVoices(): void {
  if (!isSpeechSupported()) return;

  const refresh = () => {
    preferredVoice = pickVoice();
  };

  refresh();
  window.speechSynthesis.addEventListener("voiceschanged", refresh);
  void waitForVoices();
}

export function getAccessibleName(el: HTMLElement): string {
  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl?.textContent?.trim()) return labelEl.textContent.trim();
  }

  const aria = el.getAttribute("aria-label")?.trim();
  if (aria) return aria;

  const title = el.getAttribute("title")?.trim();
  if (title) return title;

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    const id = el.id;
    if (id) {
      const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
      if (label?.textContent?.trim()) {
        const hint = el instanceof HTMLInputElement && el.placeholder ? `, ${el.placeholder}` : "";
        return `${label.textContent.trim()}${hint}`;
      }
    }
    if (el instanceof HTMLInputElement && el.placeholder) return el.placeholder;
  }

  const text = el.textContent?.replace(/\s+/g, " ").trim();
  if (text) return text.length > 140 ? `${text.slice(0, 137)}…` : text;

  return el.tagName.toLowerCase();
}

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, summary, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="switch"], [role="checkbox"], [role="radio"]';

export function getInteractiveTarget(el: HTMLElement): HTMLElement | null {
  const match = el.closest(INTERACTIVE_SELECTOR);
  return match instanceof HTMLElement ? match : null;
}

export function isAnnouncableElement(el: HTMLElement): boolean {
  if (el.closest("#accessibility-panel") || el.closest('[data-a11y-silent="true"]')) return false;

  const interactive = getInteractiveTarget(el);
  if (interactive) return true;

  const hasTabIndex = el.tabIndex >= 0 && !el.hasAttribute("disabled");
  const role = el.getAttribute("role");
  return hasTabIndex || !!role;
}
