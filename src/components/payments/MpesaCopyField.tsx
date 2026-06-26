"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";

export function MpesaCopyField({
  label,
  value,
  compact,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-xl border border-gold/20 bg-deep-blue/40 ${
        compact ? "px-3 py-2" : "px-4 py-3"
      }`}
    >
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`font-mono font-semibold truncate ${compact ? "text-sm" : "text-base"}`}>{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-lg border border-gold/30 p-2 text-gold hover:bg-gold/10"
        title={`Copy ${label}`}
      >
        {copied ? <Check className="h-4 w-4 text-life-green" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
