"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, Loader2, Smartphone, Sparkles, Wallet } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { paymentPolicy } from "@/data/policies";
import { apiUrl } from "@/lib/api-base";

const AI_PRICE = 100;
const AI_HOURS = 12;

export type SessionStatus = {
  active: boolean;
  priceKes: number;
  durationHours: number;
  expiresAt: string | null;
  remainingMs: number;
};

type Props = {
  featureLabel: string;
  preview?: React.ReactNode;
  children: React.ReactNode;
};

function formatRemaining(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export function AiSessionGate({ featureLabel, preview, children }: Props) {
  const [session, setSession] = useState<SessionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [payMsg, setPayMsg] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/api/me/ai-session"), { credentials: "include" });
      if (res.ok) {
        setSession(await res.json());
      } else {
        setSession({
          active: false,
          priceKes: AI_PRICE,
          durationHours: AI_HOURS,
          expiresAt: null,
          remainingMs: 0,
        });
      }
    } catch {
      setSession({
        active: false,
        priceKes: AI_PRICE,
        durationHours: AI_HOURS,
        expiresAt: null,
        remainingMs: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!session?.active) return;
    const t = setInterval(refresh, 60_000);
    return () => clearInterval(t);
  }, [session?.active, refresh]);

  async function pollPayment(paymentId: string) {
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const res = await fetch(apiUrl(`/api/payments/mpesa/${paymentId}`), { credentials: "include" });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.payment?.status === "completed") {
        await refresh();
        setPayMsg("Payment received — AI unlocked for 12 hours.");
        return;
      }
      if (data.payment?.status === "failed") {
        setPayMsg("Payment failed. Try again.");
        return;
      }
    }
    setPayMsg("Waiting for M-Pesa. Refresh after you pay on your phone.");
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

  if (loading || !session) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (session.active) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-life-green/30 bg-life-green/10 px-4 py-2 text-sm">
          <Sparkles className="h-4 w-4 text-life-green" />
          <span>AI session active</span>
          <span className="text-muted-foreground">·</span>
          <Clock className="h-3.5 w-3.5" />
          <span>{formatRemaining(session.remainingMs)} remaining</span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {preview}
      <GlassCard className="border-gold/30">
        <div className="flex items-start gap-3 mb-4">
          <Wallet className="h-6 w-6 text-gold shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Self-service AI — KES {AI_PRICE}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Use <strong>{featureLabel}</strong> without involving our team. Pay{" "}
              <strong className="text-gold">KES {AI_PRICE}</strong> via Safaricom M-Pesa for a{" "}
              <strong>{AI_HOURS}-hour</strong> AI session. After {AI_HOURS} hours, pay again to continue.
            </p>
          </div>
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
          Till {paymentPolicy.tillNumber} ({paymentPolicy.tillName}). Receipt appears in Finance automatically.
        </p>
        {payMsg && (
          <p className={`text-sm mt-3 ${payMsg.includes("failed") ? "text-red-400" : "text-life-green"}`}>
            {payMsg}
          </p>
        )}
      </GlassCard>
    </div>
  );
}
