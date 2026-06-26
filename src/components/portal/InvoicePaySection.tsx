"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { InvoiceDepositPayPanel } from "@/components/portal/InvoiceDepositPayPanel";
import { Button } from "@/components/ui/Button";

type Props = {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  onPaid?: () => void;
};

export function InvoicePaySection({ invoiceId, invoiceNumber, amount, currency, status, onPaid }: Props) {
  const [open, setOpen] = useState(false);
  const paid = status.toLowerCase() === "paid";

  if (paid) {
    return (
      <p className="text-sm text-life-green font-medium mt-3">Paid — thank you!</p>
    );
  }

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          className="gap-1.5"
        >
          Pay {currency} {amount.toLocaleString()} with M-Pesa
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        <Button href={`/pay?invoice=${invoiceId}`} size="sm" variant="outline">
          Open payment page
        </Button>
      </div>
      {open && (
        <div className="mt-4 rounded-xl border border-gold/20 bg-deep-blue/30 p-4">
          <InvoiceDepositPayPanel
            compact
            invoiceId={invoiceId}
            invoiceNumber={invoiceNumber}
            amount={amount}
            description={`Invoice ${invoiceNumber}`}
            onPaid={onPaid}
          />
        </div>
      )}
    </div>
  );
}
