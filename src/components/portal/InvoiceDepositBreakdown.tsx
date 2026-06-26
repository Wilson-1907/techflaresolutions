"use client";

import { paymentPolicy } from "@/data/policies";

type Props = {
  total: number;
  currency?: string;
  depositPercent?: number;
  depositPaid?: boolean;
  compact?: boolean;
};

export function InvoiceDepositBreakdown({
  total,
  currency = "KES",
  depositPercent = 60,
  depositPaid = false,
  compact = false,
}: Props) {
  const balancePercent = 100 - depositPercent;
  const depositDue = Math.round(total * (depositPercent / 100));
  const balanceDue = total - depositDue;

  if (compact) {
    return (
      <div className="text-sm space-y-1 mt-2">
        <p>
          <span className="text-muted-foreground">Project total:</span>{" "}
          <strong className="text-gold">
            {currency} {total.toLocaleString()}
          </strong>
        </p>
        <p>
          <span className="text-muted-foreground">Deposit ({depositPercent}%):</span>{" "}
          <strong>{currency} {depositDue.toLocaleString()}</strong>
          {depositPaid ? <span className="text-life-green ml-1">· paid</span> : <span className="text-amber-400 ml-1">· due now</span>}
        </p>
        <p className="text-muted-foreground text-xs">
          Balance ({balancePercent}%): {currency} {balanceDue.toLocaleString()} — due at delivery / presentation
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm space-y-3">
      <p className="font-semibold text-gold">Payment schedule (60% / 40%)</p>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-xs text-muted-foreground">Project total</p>
          <p className="text-lg font-bold text-gold">
            {currency} {total.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-xs text-muted-foreground">Deposit ({depositPercent}%)</p>
          <p className="text-lg font-bold">
            {currency} {depositDue.toLocaleString()}
          </p>
          <p className="text-xs mt-1 text-muted-foreground">{paymentPolicy.deposit}</p>
          {depositPaid ? (
            <p className="text-xs text-life-green mt-1">Paid</p>
          ) : (
            <p className="text-xs text-amber-400 mt-1">Due before work begins</p>
          )}
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-xs text-muted-foreground">Balance ({balancePercent}%)</p>
          <p className="text-lg font-bold">
            {currency} {balanceDue.toLocaleString()}
          </p>
          <p className="text-xs mt-1 text-muted-foreground">{paymentPolicy.balance}</p>
        </div>
      </div>
    </div>
  );
}
