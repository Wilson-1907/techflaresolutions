export type JobPosition = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description?: string;
  requirements?: string;
};

/** Client-side refresh (same-origin /api/jobs route). */
export async function fetchJobPositionsClient(): Promise<JobPosition[]> {
  try {
    const res = await fetch("/api/jobs", { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { jobs?: JobPosition[] };
    return data.jobs ?? [];
  } catch {
    return [];
  }
}
