import type { PortalData } from "./usePortalData";
import type { RevisionTarget } from "./QuickRevisionPanel";

export function buildClientRevisionItems(data: PortalData): RevisionTarget[] {
  const workflows = (data.workflows ?? []).filter(
    (w) => w.status && !["REJECTED", "PENDING_ADMIN"].includes(w.status)
  );

  return [
    ...workflows.map((w) => ({
      id: w.id,
      type: "workflow" as const,
      title: w.title,
      subtitle: `${w.projectNumber ? `${w.projectNumber} · ` : ""}${(w.status ?? "").replace(/_/g, " ").toLowerCase()}`,
    })),
    ...data.projects.map((p) => ({
      id: p.id,
      type: "project" as const,
      title: p.name,
      subtitle: p.status.replace(/_/g, " ").toLowerCase(),
    })),
    ...data.solutions.map((s) => ({
      id: s.id,
      type: "solution" as const,
      title: s.problem.slice(0, 80) + (s.problem.length > 80 ? "…" : ""),
      subtitle: `request · ${s.status.replace(/_/g, " ").toLowerCase()}`,
    })),
    ...data.orders.map((o) => ({
      id: o.id,
      type: "order" as const,
      title: o.productTitle,
      subtitle: `purchase · ${o.status}`,
    })),
  ];
}

export type RateableItem = {
  type: "product" | "service" | "project" | "workflow";
  ref: string;
  title: string;
};

export function buildClientRateableItems(data: PortalData): RateableItem[] {
  return [
    ...(data.workflows ?? [])
      .filter((w) => w.status && ["COMPLETED", "IN_PROGRESS", "WORK_STARTED"].includes(w.status))
      .map((w) => ({
        type: "workflow" as const,
        ref: w.id,
        title: w.title,
      })),
    ...data.orders.map((o) => ({
      type: "product" as const,
      ref: o.id,
      title: o.productTitle,
    })),
    ...data.solutions.map((s) => ({
      type: "service" as const,
      ref: s.id,
      title: s.problem.slice(0, 60),
    })),
    ...data.projects.map((p) => ({
      type: "project" as const,
      ref: p.id,
      title: p.name,
    })),
  ];
}
