"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, QrCode, Smartphone, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { paymentPolicy } from "@/data/policies";
import { SafaricomMpesaBrand } from "@/components/payments/SafaricomMpesaBrand";
import { MpesaCopyField } from "@/components/payments/MpesaCopyField";
import { useMpesaPaymentPoll } from "@/components/payments/useMpesaPaymentPoll";

type Props = {
  amount: number;
  referenceType: "invoice" | "order" | "general" | "ai_session";
  referenceId?: string;
  description?: string;
  compact?: boolean;
  onPaymentComplete?: () => void;
};

type PayMethod = "stk" | "qr" | "manual";

type TillInfo = {
  tillNumber: string;
  tillName: string;
  stkEnabled: boolean;
  qrEnabled?: boolean;
  manualSteps?: string[];
};

type CheckoutPayload = {
  amount: number;
  referenceType: Props["referenceType"];
  referenceId?: string;
  description?: string;
};

export function MpesaPaymentForm({ amount, referenceType, referenceId, description, compact, onPaymentComplete }: Props) {
  const [method, setMethod] = useState<PayMethod>("stk");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [till, setTill] = useState<TillInfo | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [manualDetails, setManualDetails] = useState<{
    tillNumber: string;
    tillName: string;
    accountReference: string;
    manualSteps: string[];
  } | null>(null);

  const checkoutBody: CheckoutPayload = {
    amount,
    referenceType,
    referenceId,
    description: description || "TechFlare payment",
  };

  useEffect(() => {
    fetch("/api/payments/mpesa/till")
      .then((r) => r.json())
      .then((d) => setTill(d))
      .catch(() =>
        setTill({
          tillNumber: paymentPolicy.tillNumber,
          tillName: paymentPolicy.tillName,
          stkEnabled: false,
          qrEnabled: false,
        }),
      );
  }, []);

  const onPollUpdate = useCallback(
    (status: "completed" | "failed" | "pending") => {
      if (status === "completed") {
        setResult({ ok: true, message: "Payment received. Receipt will appear in your portal shortly." });
        onPaymentComplete?.();
      } else if (status === "failed") {
        setResult({ ok: false, message: "Payment was not completed. Try again or use another method." });
      }
    },
    [onPaymentComplete],
  );

  useMpesaPaymentPoll(paymentId, onPollUpdate);

  async function payWithStk(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setPaymentId(null);
    try {
      const res = await fetch("/api/payments/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...checkoutBody, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      if (data.paymentId) setPaymentId(data.paymentId);
      setResult({
        ok: true,
        message:
          data.message ||
          (data.mode === "manual"
            ? `Pay KES ${amount.toLocaleString()} to Till ${data.tillNumber}. Reference ${data.accountReference}.`
            : "Check your phone — enter your M-Pesa PIN on the Safaricom prompt."),
      });
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : "Payment failed" });
    } finally {
      setLoading(false);
    }
  }

  async function loadQr() {
    setLoading(true);
    setResult(null);
    setQrImage(null);
    setPaymentId(null);
    try {
      const res = await fetch("/api/payments/mpesa/qr-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(checkoutBody),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate QR code");
      if (data.paymentId) setPaymentId(data.paymentId);
      if (data.qrCodeBase64) {
        setQrImage(data.qrCodeBase64);
        setResult({
          ok: true,
          message: "Open M-Pesa or My Safaricom app → Scan QR → confirm with your PIN.",
        });
      } else {
        setResult({ ok: true, message: data.message });
      }
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : "QR failed" });
    } finally {
      setLoading(false);
    }
  }

  async function loadManual() {
    setLoading(true);
    setResult(null);
    setPaymentId(null);
    try {
      const res = await fetch("/api/payments/mpesa/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(checkoutBody),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load payment details");
      if (data.paymentId) setPaymentId(data.paymentId);
      setManualDetails({
        tillNumber: data.tillNumber,
        tillName: data.tillName,
        accountReference: data.accountReference,
        manualSteps: data.manualSteps || [],
      });
      setResult({ ok: true, message: data.message });
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setResult(null);
    setPaymentId(null);
    setQrImage(null);
    if (method === "qr") loadQr();
    if (method === "manual") loadManual();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, amount, referenceId]);

  const tillNumber = till?.tillNumber || paymentPolicy.tillNumber;
  const tillName = till?.tillName || paymentPolicy.tillName;
  const tabClass = (m: PayMethod) =>
    `flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs sm:text-sm font-medium transition-colors ${
      method === m ? "bg-gold text-black" : "text-muted-foreground hover:bg-gold/10"
    }`;

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <SafaricomMpesaBrand compact={compact} />
      <p className="text-sm text-muted-foreground">
        Pay <strong className="text-gold">KES {amount.toLocaleString()}</strong> to Till{" "}
        <strong className="text-gold">{tillNumber}</strong> ({tillName})
      </p>

      <div className="flex gap-1 rounded-xl border border-gold/20 bg-deep-blue/30 p-1">
        <button type="button" className={tabClass("stk")} onClick={() => setMethod("stk")}>
          <Smartphone className="h-4 w-4 shrink-0" />
          Phone
        </button>
        <button type="button" className={tabClass("qr")} onClick={() => setMethod("qr")}>
          <QrCode className="h-4 w-4 shrink-0" />
          Scan QR
        </button>
        <button type="button" className={tabClass("manual")} onClick={() => setMethod("manual")}>
          <Store className="h-4 w-4 shrink-0" />
          Manual
        </button>
      </div>

      {method === "stk" && (
        <form onSubmit={payWithStk} className="space-y-3">
          <p className="text-xs text-muted-foreground">
            We send an M-Pesa prompt to your Safaricom number — enter your PIN on your phone.
          </p>
          <input
            required
            type="tel"
            placeholder="Safaricom number (07XX XXX XXX)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 text-sm"
          />
          <Button type="submit" disabled={loading || !phone.trim()} size={compact ? "sm" : "md"} className="w-full sm:w-auto">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
            Send M-Pesa prompt
          </Button>
        </form>
      )}

      {method === "qr" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Scan with the <strong>M-Pesa</strong> or <strong>My Safaricom</strong> app. Amount and till are filled
            automatically.
          </p>
          {loading && !qrImage ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : qrImage ? (
            <div className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${qrImage}`}
                alt={`M-Pesa QR code for KES ${amount}`}
                className="h-56 w-56 rounded-xl border border-gold/30 bg-white p-2"
              />
              <Button type="button" variant="outline" size="sm" onClick={loadQr} disabled={loading}>
                Refresh QR
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={loadQr} disabled={loading} size={compact ? "sm" : "md"}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
              Generate QR code
            </Button>
          )}
        </div>
      )}

      {method === "manual" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Copy the details below, then pay via Lipa na M-Pesa → Buy Goods.</p>
          {loading && !manualDetails ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          ) : (
            <>
              <MpesaCopyField label="Till number" value={manualDetails?.tillNumber || tillNumber} compact={compact} />
              <MpesaCopyField label="Amount (KES)" value={String(amount)} compact={compact} />
              {manualDetails?.accountReference && (
                <MpesaCopyField label="Reference" value={manualDetails.accountReference} compact={compact} />
              )}
              <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground rounded-xl border border-gold/15 px-3 py-2">
                {(manualDetails?.manualSteps || till?.manualSteps || [
                  "Open M-Pesa → Lipa na M-Pesa → Buy Goods",
                  `Till ${tillNumber}`,
                  `Amount KES ${amount.toLocaleString()}`,
                  "Confirm with your PIN",
                ]).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}

      {paymentId && result?.ok && (
        <p className="text-xs text-muted-foreground animate-pulse">Waiting for payment confirmation…</p>
      )}
      {result && (
        <p className={`text-sm ${result.ok ? "text-life-green" : "text-red-400"}`}>{result.message}</p>
      )}
    </div>
  );
}
