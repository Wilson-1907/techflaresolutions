"use client";

import { useEffect } from "react";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest('input, textarea, select, [contenteditable="true"]');
}

export function CopyProtection() {
  useEffect(() => {
    document.body.classList.add("copy-protected");

    function blockCopy(event: ClipboardEvent) {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
    }

    function blockDrag(event: DragEvent) {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
    }

    function blockContextMenu(event: MouseEvent) {
      if (isEditableTarget(event.target)) return;
      const el = event.target instanceof HTMLElement ? event.target : null;
      if (el?.closest("img, video, canvas, svg, a[href], button")) {
        event.preventDefault();
      }
    }

    function blockKeys(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;
      const key = event.key.toLowerCase();
      const blocked =
        (event.ctrlKey || event.metaKey) &&
        ["c", "x", "u", "s"].includes(key);
      if (blocked) event.preventDefault();
    }

    document.addEventListener("copy", blockCopy);
    document.addEventListener("cut", blockCopy);
    document.addEventListener("paste", blockCopy);
    document.addEventListener("dragstart", blockDrag);
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.body.classList.remove("copy-protected");
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("cut", blockCopy);
      document.removeEventListener("paste", blockCopy);
      document.removeEventListener("dragstart", blockDrag);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  return null;
}
