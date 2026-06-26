import { CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export const SUBMISSION_SUCCESS_HEADLINE =
  "You've taken the first and most important step";

export const SUBMISSION_SUCCESS_BODY =
  "Track your submission here. Our team is reviewing it now — please wait for our response. You will see whether it is approved or rejected, and we will email you too.";

type SubmissionSuccessCardProps = {
  title?: string;
  trackLabel?: string;
  trackHref?: string;
  detail?: string;
};

export function SubmissionSuccessCard({
  title = SUBMISSION_SUCCESS_HEADLINE,
  trackLabel,
  trackHref,
  detail,
}: SubmissionSuccessCardProps) {
  return (
    <GlassCard className="border-life-green/30 text-center py-8">
      <CheckCircle2 className="h-10 w-10 text-life-green mx-auto mb-3" aria-hidden />
      <p className="font-semibold text-life-green mb-2">{title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
        {detail ?? SUBMISSION_SUCCESS_BODY}
      </p>
      {trackLabel && trackHref && (
        <Button href={trackHref} size="sm" variant="outline" className="mt-5">
          {trackLabel}
        </Button>
      )}
    </GlassCard>
  );
}

export function SubmissionSuccessBanner({ detail }: { detail?: string }) {
  return (
    <div className="mb-4 rounded-xl border border-life-green/30 bg-life-green/10 px-4 py-3 text-sm text-life-green">
      <p className="font-semibold">{SUBMISSION_SUCCESS_HEADLINE}</p>
      <p className="text-muted-foreground mt-1 leading-relaxed">{detail ?? SUBMISSION_SUCCESS_BODY}</p>
    </div>
  );
}
