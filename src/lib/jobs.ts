import { headers } from "next/headers";
import type { JobPosition } from "@/lib/jobs-client";
import { serverBackendFetch } from "@/lib/backend-fetch";

export type { JobPosition } from "@/lib/jobs-client";

async function resolveJobsFetchUrl(): Promise<string | null> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto") || "https";
      return `${proto}://${host}/api/jobs`;
    }
  } catch {
    // outside a request context
  }
  return null;
}

export async function loadJobPositions(): Promise<JobPosition[]> {
  const sameOrigin = await resolveJobsFetchUrl();
  const paths = sameOrigin ? [sameOrigin] : ["/api/jobs"];

  for (const target of paths) {
    try {
      const res =
        target.startsWith("http")
          ? await fetch(target, {
              cache: "no-store",
              headers: {
                Accept: "application/json",
                "Accept-Language": "en-KE,en;q=0.9",
                "User-Agent":
                  "Mozilla/5.0 (compatible; TechFlare-Site/1.0; +https://techflare-solutions.com)",
              },
            })
          : await serverBackendFetch(target);
      if (!res.ok) continue;
      const data = (await res.json()) as { jobs?: JobPosition[] };
      const jobs = data.jobs ?? [];
      return jobs;
    } catch {
      continue;
    }
  }

  return [];
}
