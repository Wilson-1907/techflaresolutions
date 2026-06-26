/** Safaricom / M-PESA brand bar for payment flows (Daraja Lipa na M-Pesa). */
export function SafaricomMpesaBrand({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-[#43B02A]/30 bg-[#43B02A]/10 ${
        compact ? "px-3 py-2" : "px-4 py-3"
      }`}
    >
      <SafaricomMark className={compact ? "h-8 w-8 shrink-0" : "h-10 w-10 shrink-0"} />
      <div className="min-w-0">
        <p className={`font-bold tracking-wide text-[#43B02A] ${compact ? "text-sm" : "text-base"}`}>
          M-PESA
        </p>
        <p className={`text-muted-foreground ${compact ? "text-[10px]" : "text-xs"}`}>
          Powered by Safaricom · Daraja API
        </p>
      </div>
    </div>
  );
}

function SafaricomMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#43B02A" />
      <path
        d="M12 28c4-8 10-12 18-12 2 0 4 .5 6 1.5-3 1-5.5 3-7.5 6-2 3-3 6.5-3 10.5H12z"
        fill="#fff"
        opacity="0.95"
      />
      <path d="M30 14c5 2 8 6 9 11-4-1-7-3.5-9-7.5S30 14 30 14z" fill="#E4002B" />
    </svg>
  );
}
