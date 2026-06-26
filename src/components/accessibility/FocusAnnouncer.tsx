"use client";

import { useEffect } from "react";
import {
  getAccessibleName,
  getInteractiveTarget,
  isAnnouncableElement,
  speak,
} from "@/lib/speech-guide";
import { useAccessibility } from "./AccessibilityProvider";

export function FocusAnnouncer() {
  const { settings } = useAccessibility();

  useEffect(() => {
    if (!settings.audioGuide) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const announceTarget = (target: HTMLElement) => {
      const interactive = getInteractiveTarget(target) ?? target;
      if (!isAnnouncableElement(interactive)) return;

      const name = getAccessibleName(interactive);
      if (!name || name.length < 2) return;

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        speak(name, { interrupt: true });
      }, 200);
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      announceTarget(target);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const interactive = getInteractiveTarget(target);
      if (!interactive) return;
      announceTarget(interactive);
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("click", onClick, true);
      if (timer) clearTimeout(timer);
    };
  }, [settings.audioGuide]);

  return null;
}
