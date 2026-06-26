"use client";

import { useState } from "react";
import { Loader2, Smartphone, Wallet, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { paymentPolicy } from "@/data/policies";
import { apiUrl } from "@/lib/api-base";

const AI_PRICE = 100;

type Props = {
  featureLabel: string;
  onPaid?: () => void;
  onCancel?: () => void;
};

export function AiSessionPaywall({ featureLabel, onPaid, onCancel }: Props) {
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [payMsg, setPayMsg] = useState<string | null>(null);

  async function pollPayment(paymentId: string) {
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const res = await fetch(apiUrl(`/api/payments/mpesa/${paymentId}`), { credentials: "include" });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.payment?.status === "completed") {
        setPayMsg("Payment received — AI unlocked for 12 hours.");
        onPaid?.();
        return;
      }
      if (data.payment?.status === "failed") {
        setPayMsg("Payment failed. Try again.");
        return;
      }
    }
    setPayMsg("Still waiting for M-Pesa. Tap refresh after you pay on your phone.");
  }

  async function startPayment(e: React.FormEvent) {
    e.preventDefault();
    setPaying(true);
    setPayMsg(null);
    try {
      const res = await fetch("/api/payments/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone,
          amount: AI_PRICE,
          referenceType: "ai_session",
          description: `AI Self-Service — ${featureLabel}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      setPayMsg(data.message || "Check your phone and enter your M-Pesa PIN.");
      if (data.paymentId && data.mode === "stk") pollPayment(data.paymentId);
    } catch (err) {
      setPayMsg(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  return (
    <GlassCard className="border-gold/40">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <Wallet className="h-6 w-6 text-gold shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Pay to use AI — KES {AI_PRICE}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your Safaricom number. You will get an M-Pesa prompt — enter your PIN to unlock{" "}
              <strong>{featureLabel}</strong> for 12 hours.
            </p>
          </div>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-1 hover:bg-white/10 rounded-lg" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <form onSubmit={startPayment} className="space-y-3">
        <input
          required
          type="tel"
          placeholder="Safaricom number (07XX XXX XXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 text-sm"
        />
        <Button type="submit" disabled={paying || !phone.trim()} className="w-full sm:w-auto">
          {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
          Pay KES {AI_PRICE} — send M-Pesa prompt
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-3">
        Till {paymentPolicy.tillNumber} ({paymentPolicy.tillName})
      </p>
      {payMsg && (
        <p className={`text-sm mt-3 ${payMsg.includes("failed") ? "text-red-400" : "text-life-green"}`}>{payMsg}</p>
      )}
    </GlassCard>
  );
}
