import { NextResponse } from "next/server";

/** Share auth cookie across www and apex on custom domains. */
export function getAuthCookieDomain(): string | undefined {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) return undefined;
  try {
    const host = new URL(appUrl).hostname;
    if (host === "localhost" || host.endsWith(".vercel.app")) return undefined;
    if (host.startsWith("www.")) return `.${host.slice(4)}`;
    return `.${host}`;
  } catch {
    return undefined;
  }
}

function authCookieOptions(maxAge: number) {
  const domain = getAuthCookieDomain();
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
    ...(domain ? { domain } : {}),
  };
}

export function setAuthCookieOnResponse(response: NextResponse, token: string) {
  response.cookies.set("auth_token", token, authCookieOptions(60 * 60 * 24 * 7));
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set("auth_token", "", authCookieOptions(0));
}
