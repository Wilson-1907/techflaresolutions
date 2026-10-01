"use client";

import { useSyncExternalStore } from "react";

export function useClientReady(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function useIntroSeen(key: string): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return sessionStorage.getItem(key) === "1";
      } catch {
        return true;
      }
    },
    () => false
  );
}
