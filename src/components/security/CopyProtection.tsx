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

    document.addEventListener("copy", blockCopy);
    document.addEventListener("cut", blockCopy);
    document.addEventListener("paste", blockCopy);
    document.addEventListener("dragstart", blockDrag);

    return () => {
      document.body.classList.remove("copy-protected");
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("cut", blockCopy);
      document.removeEventListener("paste", blockCopy);
      document.removeEventListener("dragstart", blockDrag);
    };
  }, []);

  return null;
}
