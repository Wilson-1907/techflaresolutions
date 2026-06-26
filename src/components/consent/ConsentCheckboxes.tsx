import Link from "next/link";

/** Terms acceptance — register / sign-up page only */
export function RegisterTermsCheckbox({
  accepted,
  onChange,
  className = "",
}: {
  accepted: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}) {
  return (
    <label className={`flex items-start gap-2.5 text-sm cursor-pointer ${className}`}>
      <input
        type="checkbox"
        required
        checked={accepted}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-gold"
      />
      <span>
        I accept the{" "}
        <Link href="/terms" className="text-gold hover:underline" target="_blank">
          Terms &amp; Conditions
        </Link>{" "}
        <span className="text-red-400">*</span>
      </span>
    </label>
  );
}

/** @deprecated Use RegisterTermsCheckbox on /register only */
export type ConsentState = { acceptedTerms: boolean; receiveCommunications: boolean };
export const defaultConsentState: ConsentState = { acceptedTerms: false, receiveCommunications: false };
export function consentBlocksSubmit(consent: ConsentState): boolean {
  return !consent.acceptedTerms;
}
