import { GlassCard } from "@/components/ui/GlassCard";
import { workflowStages } from "@/data/policies";

/** Workflow steps only — no payment UI (payment notice is on submit forms). */
export function WorkflowPanel({ compact = false }: { compact?: boolean }) {
  return (
    <GlassCard className="mb-8 border-gold/20">
      <h2 className="text-lg font-bold mb-2">How Your Work Moves Forward</h2>
      <p className="text-sm text-muted-foreground mb-4">
        After you submit, you&apos;ve taken the first important step. Track progress in your portal and wait for our team — each item is reviewed and marked approved or rejected. After approval, invoices and timelines are sent by email.
      </p>
      {!compact && (
        <div className="space-y-3">
          {workflowStages.map((stage, i) => (
            <div key={stage.key} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{stage.label}</p>
                <p className="text-muted-foreground">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
