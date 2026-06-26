"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { paymentPolicy } from "@/data/policies";
import { InvoiceDepositPayPanel } from "@/components/portal/InvoiceDepositPayPanel";
import { MpesaPaymentForm } from "@/components/payments/MpesaPaymentForm";

function PayContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoice") || "";
  const amountParam = searchParams.get("amount");
  const [invoice, setInvoice] = useState<{
    id: string;
    number: string;
    total: number;
    currency: string;
    status: string;
    clientName: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!invoiceId) return;
    fetch(`/api/payments/invoice/${invoiceId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.invoice) setInvoice(d.invoice);
        else setError(d.error || "Invoice not found");
      })
      .catch(() => setError("Could not load invoice"));
  }, [invoiceId]);

  const payAmount = invoice
    ? invoice.total
    : amountParam
      ? parseFloat(amountParam)
      : 0;

  if (!invoiceId && !amountParam) {
    return (
      <GlassCard className="max-w-lg mx-auto text-center py-12">
        <p className="text-muted-foreground mb-2">Open a payment link from your portal or invoice email.</p>
        <p className="text-sm text-gold">M-Pesa Till {paymentPolicy.tillNumber} only</p>
      </GlassCard>
    );
  }

  if (error) {
    return <GlassCard className="max-w-lg mx-auto text-center py-12"><p className="text-red-400">{error}</p></GlassCard>;
  }

  if (invoiceId && !invoice) {
    return <GlassCard className="max-w-lg mx-auto text-center py-12"><p className="text-muted-foreground">Loading invoice...</p></GlassCard>;
  }

  if (invoice?.status === "paid") {
    return (
      <GlassCard className="max-w-lg mx-auto text-center py-12 border-life-green/30">
        <p className="text-life-green font-semibold">Invoice {invoice.number} is already paid. Thank you!</p>
      </GlassCard>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {invoice && (
        <GlassCard>
          <h2 className="text-xl font-bold mb-1">Invoice {invoice.number}</h2>
          <p className="text-muted-foreground text-sm mb-2">{invoice.clientName}</p>
          <p className="text-2xl font-bold text-gold">{invoice.currency} {invoice.total.toLocaleString()}</p>
        </GlassCard>
      )}
      <GlassCard>
        <h3 className="font-bold mb-4">M-Pesa Payment</h3>
        {invoice ? (
          <InvoiceDepositPayPanel
            invoiceId={invoice.id}
            invoiceNumber={invoice.number}
            amount={payAmount}
            description={`Invoice ${invoice.number}`}
          />
        ) : (
          <MpesaPaymentForm amount={payAmount} referenceType="general" description="TechFlare payment" />
        )}
      </GlassCard>
    </div>
  );
}

export default function PayPage() {
  return (
    <>
      <PageHeader title="Invoice Payment" subtitle={`M-Pesa Till ${paymentPolicy.tillNumber} — ${paymentPolicy.tillName}`} badge="Pay" />
      <section className="pb-24 px-4">
        <Suspense fallback={<p className="text-center text-muted-foreground">Loading...</p>}>
          <PayContent />
        </Suspense>
      </section>
    </>
  );
}
