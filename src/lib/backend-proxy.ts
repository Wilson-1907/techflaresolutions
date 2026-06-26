import { cookies } from "next/headers";
import { getApiBaseUrl } from "./api-base";
import { getAppOrigin } from "./app-origin";

/** Forward session cookie + Bearer token so backend auth works through the BFF proxy. */
export async function buildProxyAuthHeaders(req?: Request): Promise<Headers> {
  const headers = new Headers();
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (token) {
    headers.set("Cookie", `auth_token=${token}`);
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    const cookie = req?.headers.get("cookie");
    if (cookie) {
      headers.set("Cookie", cookie);
      const match = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
      if (match?.[1]) {
        headers.set("Authorization", `Bearer ${decodeURIComponent(match[1])}`);
      }
    }
  }
  return headers;
}

export function requireBackendUrl(): string {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error("Set NEXT_PUBLIC_API_URL or BACKEND_URL on the frontend deployment.");
  }
  return base;
}

function applyTrustedProxyHeaders(headers: Headers, req?: Request) {
  if (req) {
    const cookie = req.headers.get("cookie");
    if (cookie) headers.set("cookie", cookie);
    const origin = req.headers.get("origin");
    if (origin) headers.set("origin", origin);
    const contentType = req.headers.get("content-type");
    if (contentType && !headers.has("content-type")) {
      headers.set("content-type", contentType);
    }
    const ua = req.headers.get("user-agent");
    if (ua) headers.set("user-agent", ua);
    const lang = req.headers.get("accept-language");
    if (lang) headers.set("accept-language", lang);
    const accept = req.headers.get("accept");
    if (accept) headers.set("accept", accept);
  }

  if (!headers.has("origin")) {
    headers.set("origin", getAppOrigin());
  }
  if (!headers.has("accept")) {
    headers.set("accept", "application/json");
  }
}

export async function proxyToBackend(
  path: string,
  init: RequestInit & { req?: Request; withAuth?: boolean }
) {
  const url = `${requireBackendUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  if (init.withAuth) {
    const authHeaders = await buildProxyAuthHeaders(init.req);
    authHeaders.forEach((value, key) => headers.set(key, value));
  }
  applyTrustedProxyHeaders(headers, init.req);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 28_000);
  try {
    return await fetch(url, { ...init, headers, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
