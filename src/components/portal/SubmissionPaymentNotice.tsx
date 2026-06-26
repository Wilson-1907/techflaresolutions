import { paymentPolicy, reviewSla } from "@/data/policies";

/** Shown on idea/job submit forms only — not on the portal dashboard. */
export function SubmissionPaymentNotice() {
  return (
    <div className="rounded-xl border border-gold/20 bg-deep-blue/40 p-4 text-sm text-muted-foreground space-y-2 mb-4">
      <p className="font-medium text-gold">What happens next</p>
      <p>
        We review your submission {reviewSla}. If approved, you will receive an{" "}
        <strong className="text-foreground">invoice by email</strong> with scope, timeline, and payment terms.
      </p>
      <p>
        <strong className="text-gold">Important:</strong> {paymentPolicy.startCondition}
      </p>
      <p className="text-xs">
        {paymentPolicy.deposit}. {paymentPolicy.balance}. Full policy in Terms &amp; Conditions.
      </p>
    </div>
  );
}
