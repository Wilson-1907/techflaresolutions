import { GlassCard } from "@/components/ui/GlassCard";
import { paymentPolicy } from "@/data/policies";
import { company } from "@/data/site";

export function PaymentDetailsSection({ compact }: { compact?: boolean }) {
  return (
    <GlassCard className={compact ? "mb-4 border-gold/20 p-4" : "mb-6 border-gold/25"}>
      <h2 className={compact ? "text-base font-bold mb-2" : "text-lg font-bold mb-3"}>Payment details</h2>
      <dl className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Method</dt>
          <dd className="font-medium">M-Pesa Till only</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Till number</dt>
          <dd className="font-bold text-gold">{paymentPolicy.tillNumber}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Till name</dt>
          <dd className="font-medium">{paymentPolicy.tillName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Deposit</dt>
          <dd>{paymentPolicy.deposit}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Balance</dt>
          <dd>{paymentPolicy.balance}</dd>
        </div>
      </dl>
      <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
        {paymentPolicy.channel} Enter your Safaricom number on any invoice and confirm with your M-Pesa PIN on your phone.
        Questions? Call{" "}
        <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="text-gold underline">
          {company.phone}
        </a>{" "}
        or email{" "}
        <a href={`mailto:${company.email}`} className="text-gold underline">
          {company.email}
        </a>
        .
      </p>
    </GlassCard>
  );
}
