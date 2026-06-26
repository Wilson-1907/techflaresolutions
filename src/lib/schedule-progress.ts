import { workflowStages } from "@/data/policies";

export type ScheduleStep = {
  title: string;
  dueDate?: string | null;
  completed?: boolean;
  description?: string | null;
};

export function computeSchedulePercent(steps: ScheduleStep[], fallback = 0): number {
  if (steps.length === 0) return Math.min(100, Math.max(0, Math.round(fallback)));
  const done = steps.filter((s) => s.completed).length;
  return Math.round((done / steps.length) * 100);
}

export function projectMilestonesToSteps(
  milestones: Array<{ title: string; completed: boolean; dueDate?: string | null; description?: string | null }>
): ScheduleStep[] {
  return milestones.map((m) => ({
    title: m.title,
    dueDate: m.dueDate ?? null,
    completed: m.completed,
    description: m.description ?? null,
  }));
}

const defaultProjectSchedule = [
  "Agreed Scope & Research",
  "Development & Coding",
  "Testing & Quality Review",
  "Presentation / Delivery",
];

export function defaultProjectSteps(status: string, progress: number): ScheduleStep[] {
  const statusOrder = ["PLANNING", "IN_PROGRESS", "REVIEW", "COMPLETED"];
  const idx = statusOrder.indexOf(status);

  return defaultProjectSchedule.map((title, i) => ({
    title,
    completed:
      status === "COMPLETED" ||
      (idx >= 0 && i < idx) ||
      (idx >= 0 && i === idx && progress >= Math.round(((i + 1) / defaultProjectSchedule.length) * 100)),
  }));
}

export function resolveProjectSchedule(
  milestones: Array<{ title: string; completed: boolean; dueDate?: string | null; description?: string | null }>,
  status: string,
  progress: number
) {
  const steps =
    milestones.length > 0
      ? projectMilestonesToSteps(milestones)
      : defaultProjectSteps(status, progress);
  const percent = computeSchedulePercent(steps, progress);
  return { steps, percent };
}

const ideaReviewKeys = ["SUBMITTED", "RESEARCH_REVIEW", "APPROVED"] as const;

function ideaReviewIndex(status: string): number {
  const map: Record<string, number> = {
    SUBMITTED: 0,
    RESEARCH_REVIEW: 1,
    RISK_ASSESSMENT: 1,
    FEASIBILITY_ANALYSIS: 1,
    APPROVED: 2,
    IN_DEVELOPMENT: 2,
    REVIEW: 2,
  };
  return map[status] ?? 0;
}

/** Review-status steps only — no delivery % until deposit receipt (see workflow finance stages). */
export function ideaStatusToSteps(status: string, createdAt: string): { steps: ScheduleStep[]; percent: number } {
  if (status === "REJECTED") {
    return {
      steps: workflowStages.slice(0, 2).map((s) => ({
        title: s.label,
        completed: true,
        description: s.description,
      })),
      percent: 0,
    };
  }

  const idx = ideaReviewIndex(status);
  const start = new Date(createdAt);

  const steps: ScheduleStep[] = ideaReviewKeys.map((key, i) => {
    const stage = workflowStages.find((s) => s.key === key);
    const due = new Date(start);
    due.setDate(due.getDate() + i * 2);
    return {
      title: stage?.label ?? key.replace(/_/g, " "),
      description: stage?.description,
      dueDate: due.toISOString(),
      completed: idx > i,
    };
  });

  return { steps, percent: 0 };
}
