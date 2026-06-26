import { formatPortalDate } from "./usePortalData";
import type { ScheduleStep } from "@/lib/schedule-progress";
import { computeSchedulePercent } from "@/lib/schedule-progress";

export function ScheduleProgressBar({
  steps,
  percent,
  showSteps = true,
  compact = false,
  label = "Progress",
  showBar = true,
}: {
  steps: ScheduleStep[];
  percent?: number;
  showSteps?: boolean;
  compact?: boolean;
  label?: string;
  showBar?: boolean;
}) {
  const value = percent ?? computeSchedulePercent(steps);

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {showBar && (
        <div className="flex items-center gap-3">
          {!compact && <span className="text-xs font-medium text-muted-foreground shrink-0">{label}</span>}
          <div className="relative flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold transition-all duration-500"
              style={{ width: `${value}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-wide text-white drop-shadow-sm">
              {value}% done
            </span>
          </div>
          <span className="text-sm font-bold text-gold tabular-nums w-10 text-right shrink-0">{value}%</span>
        </div>
      )}

      {!showBar && !compact && label && (
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      )}

      {showSteps && steps.length > 0 && (
        <ul className={compact ? "space-y-1" : "space-y-2"}>
          {steps.map((step, i) => (
            <li key={`${step.title}-${i}`} className="flex items-start gap-2 text-sm">
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  step.completed ? "bg-life-green/20 text-life-green" : "bg-white/10 text-muted-foreground"
                }`}
                aria-hidden
              >
                {step.completed ? "✓" : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className={step.completed ? "text-muted-foreground line-through" : "font-medium"}>
                    {step.title}
                  </span>
                  {step.dueDate && (
                    <span className="text-xs text-gold/80">
                      {step.completed ? "Completed" : "Due"} {formatPortalDate(step.dueDate)}
                    </span>
                  )}
                </div>
                {!compact && step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
