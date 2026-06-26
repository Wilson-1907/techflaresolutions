"use client";

import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { MpesaPaymentForm } from "@/components/payments/MpesaPaymentForm";
import { Button } from "@/components/ui/Button";

type Props = {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  description?: string;
  compact?: boolean;
  onPaid?: () => void;
};

export function InvoiceDepositPayPanel({
  invoiceId,
  invoiceNumber,
  amount,
  description,
  compact,
  onPaid,
}: Props) {
  const [mpesaCode, setMpesaCode] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submitManualCode(e: React.FormEvent) {
    e.preventDefault();
    const code = mpesaCode.trim().toUpperCase();
    if (!code) return;

    setConfirmLoading(true);
    setConfirmMsg(null);
    try {
      const res = await fetch("/api/me/invoices/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ invoiceId, mpesaReceiptNumber: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not confirm payment");
      setConfirmMsg({
        ok: true,
        text: data.message || "Payment confirmed. Receipt is in your portal.",
      });
      setMpesaCode("");
      onPaid?.();
    } catch (err) {
      setConfirmMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Confirmation failed",
      });
    } finally {
      setConfirmLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium text-foreground mb-1">Pay deposit when you are ready</p>
        <p className="text-sm text-muted-foreground">
          Choose <strong>Phone</strong> (we send the M-Pesa prompt only when you tap pay),{" "}
          <strong>Scan QR</strong>, or <strong>Manual</strong> till payment — no rush.
        </p>
      </div>

      <MpesaPaymentForm
        compact={compact}
        amount={amount}
        referenceType="invoice"
        referenceId={invoiceId}
        description={description || `Deposit for invoice ${invoiceNumber}`}
        onPaymentComplete={onPaid}
      />

      <div className="rounded-xl border border-white/10 bg-deep-blue/30 p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-gold" />
          Already paid via Till? Enter your M-Pesa confirmation code
        </p>
        <form onSubmit={submitManualCode} className="flex flex-wrap gap-2">
          <input
            value={mpesaCode}
            onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
            placeholder="M-Pesa code e.g. THH8X9K2LM"
            className="flex-1 min-w-[12rem] rounded-lg border border-gold/20 bg-deep-blue/50 px-3 py-2 text-sm font-mono uppercase"
          />
          <Button type="submit" size="sm" disabled={confirmLoading || !mpesaCode.trim()}>
            {confirmLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm payment"}
          </Button>
        </form>
        {confirmMsg && (
          <p className={`text-xs ${confirmMsg.ok ? "text-life-green" : "text-red-400"}`}>{confirmMsg.text}</p>
        )}
        <p className="text-[10px] text-muted-foreground">
          Finance can also verify manually if automatic matching fails.
        </p>
      </div>
    </div>
  );
}
