"use client";

import { useState } from "react";
import { Loader2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/site";
import { apiUrl } from "@/lib/api-base";
import { InvoiceDepositPayPanel } from "@/components/portal/InvoiceDepositPayPanel";

type Props = {
  workflowId: string;
  title: string;
  financeDocId?: string | null;
  invoiceNumber?: string;
  depositAmount?: number | null;
  depositPercent?: number;
  onAgreed?: () => void;
  onDeclined?: () => void;
  onPaid?: () => void;
};

export function WorkflowProposalActions({
  workflowId,
  title,
  financeDocId,
  invoiceNumber,
  depositAmount,
  depositPercent = 60,
  onAgreed,
  onDeclined,
  onPaid,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [careNote, setCareNote] = useState("");
  const [showDecline, setShowDecline] = useState(false);
  const [showCare, setShowCare] = useState(false);

  async function respond(action: "agree" | "decline" | "care") {
    setBusy(true);
    try {
      const res = await fetch(apiUrl("/api/me/workflows"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          workflowId,
          action,
          reason: action === "decline" ? declineReason : action === "care" ? careNote : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : res.status === 401
              ? "Session expired — please sign in again from the client portal."
              : "Could not complete action";
        throw new Error(msg);
      }
      if (action === "agree") {
        setAgreed(true);
        onAgreed?.();
      }
      if (action === "decline") onDeclined?.();
      if (action !== "agree") {
        alert((data.message as string) || "Recorded.");
      }
      setShowDecline(false);
      setShowCare(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not complete action");
    } finally {
      setBusy(false);
    }
  }

  const showPayment = agreed && financeDocId && depositAmount != null && depositAmount > 0;

  return (
    <div className="mb-4 rounded-xl border border-gold/30 bg-gold/5 p-4">
      <p className="text-sm font-medium text-gold mb-2">Action required — invoice &amp; stages</p>
      <p className="text-sm text-muted-foreground mb-3">
        Review the stages and signed invoice below. Agree to proceed to payment, decline to withdraw, or contact
        customer care if you have questions.
      </p>
      {!agreed && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled={busy} onClick={() => respond("agree")}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Agree & proceed to payment"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowDecline((v) => !v)}>
            Decline / give up
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowCare((v) => !v)}>
            Speak to customer care
          </Button>
        </div>
      )}

      {showPayment && (
        <div className="mt-4 rounded-xl border border-gold/25 bg-deep-blue/30 p-4">
          <p className="text-sm font-medium text-foreground mb-1">
            Pay {depositPercent}% deposit — KES {depositAmount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Enter your Safaricom number below. You will receive an M-Pesa prompt on your phone to enter your PIN.
          </p>
          <InvoiceDepositPayPanel
            compact
            invoiceId={financeDocId}
            invoiceNumber={invoiceNumber || title}
            amount={depositAmount}
            description={`${depositPercent}% deposit for ${title}`}
            onPaid={onPaid}
          />
        </div>
      )}

      {showDecline && (
        <div className="mt-3 space-y-2">
          <textarea
            placeholder="Optional reason for declining"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
            rows={2}
          />
          <Button size="sm" variant="outline" disabled={busy} onClick={() => respond("decline")}>
            Confirm decline
          </Button>
        </div>
      )}
      {showCare && (
        <div className="mt-3 space-y-3">
          <textarea
            placeholder="Your question (optional — we will also notify our team)"
            value={careNote}
            onChange={(e) => setCareNote(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
            rows={2}
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={busy} onClick={() => respond("care")}>
              Notify customer care
            </Button>
            <Button href={company.whatsappLink} size="sm" variant="outline" className="gap-1">
              WhatsApp {company.phone}
            </Button>
            <Button href={`tel:${company.phone.replace(/\s/g, "")}`} size="sm" variant="outline" className="gap-1">
              <Phone className="h-3.5 w-3.5" /> Call {company.phone}
            </Button>
            <Button
              href={`mailto:${company.email}?subject=${encodeURIComponent(`Question about proposal: ${title}`)}`}
              size="sm"
              variant="outline"
              className="gap-1"
            >
              <Mail className="h-3.5 w-3.5" /> Email us
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
