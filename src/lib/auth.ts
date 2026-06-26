import { cookies } from "next/headers";
import { getApiBaseUrl } from "./api-base";
import { getAppOrigin } from "./app-origin";

export type UserRole = "CLIENT" | "INNOVATOR" | "EMPLOYEE" | "ADMIN" | "HOD" | "CIO";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  points?: number;
  communityMember?: boolean;
  emailVerified?: boolean;
}

async function fetchSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  const base = getApiBaseUrl();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/api/auth/me`, {
      headers: {
        Cookie: `auth_token=${token}`,
        Origin: getAppOrigin(),
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: AuthUser; authenticated?: boolean };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function getSessionFull() {
  return fetchSession();
}

export async function getSession() {
  return fetchSession();
}

export function requireRole(user: AuthUser | null, roles: UserRole[]) {
  return !!user && roles.includes(user.role);
}
