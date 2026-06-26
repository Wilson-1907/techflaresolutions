import type { UserRole } from "./auth";

/** Path or absolute URL for the user's home dashboard after sign-in. */
export function getPortalPathForRole(role: string): string {
  switch (role as UserRole) {
    case "INNOVATOR":
      return "/portal/innovation";
    case "EMPLOYEE":
    case "HOD":
    case "CIO":
      return "/portal/employee";
    case "ADMIN": {
      const admin = process.env.NEXT_PUBLIC_ADMIN_PANEL_URL?.replace(/\/$/, "");
      return admin ? `${admin}/dashboard` : "/portal/employee";
    }
    case "CLIENT":
    default:
      return "/portal/client";
  }
}

function resolvePortalTarget(role: string, redirectParam?: string | null): string {
  const home = getPortalPathForRole(role);

  if (!redirectParam?.startsWith("/")) return home;

  const clientPaths = ["/portal/client"];
  const innovatorPaths = ["/portal/innovation"];
  const employeePaths = ["/portal/employee"];

  if (role === "CLIENT" && clientPaths.some((p) => redirectParam === p || redirectParam.startsWith(`${p}/`))) {
    return redirectParam;
  }
  if (role === "INNOVATOR" && innovatorPaths.some((p) => redirectParam === p || redirectParam.startsWith(`${p}/`))) {
    return redirectParam;
  }
  if (["EMPLOYEE", "HOD", "CIO"].includes(role) && employeePaths.some((p) => redirectParam === p || redirectParam.startsWith(`${p}/`))) {
    return redirectParam;
  }

  return home;
}

async function waitForSession(maxAttempts = 12): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { authenticated?: boolean; user?: { role?: string } };
        if (data.authenticated && data.user) return true;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

/** Full-page navigation after auth — waits until session cookie is active. */
export async function navigateAfterAuth(
  role: string,
  _router?: { push: (path: string) => void },
  redirectParam?: string | null
) {
  const target = resolvePortalTarget(role, redirectParam);
  await waitForSession();
  window.location.assign(target);
}
