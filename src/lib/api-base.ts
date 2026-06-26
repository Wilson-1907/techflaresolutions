/**
 * API base URL for split deployment.
 * Leave empty in local monolith dev to use same-origin /api routes on the main site.
 */
export const PRODUCTION_BACKEND = "https://techflaresolutionsback.onrender.com";

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

/** Only trust URLs that point at Render (or local dev). Rejects frontend/custom-domain mistakes. */
export function isValidBackendUrl(url: string): boolean {
  try {
    const host = new URL(normalizeUrl(url)).hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return true;
    return host.endsWith(".onrender.com");
  } catch {
    return false;
  }
}

export function getApiBaseUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.BACKEND_URL,
    process.env.NODE_ENV === "production" || process.env.VERCEL ? PRODUCTION_BACKEND : "",
  ]
    .map((v) => v?.trim())
    .filter(Boolean) as string[];

  for (const candidate of candidates) {
    const normalized = normalizeUrl(candidate);
    if (isValidBackendUrl(normalized)) return normalized;
  }

  return "";
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  // Browser: same-origin /api so auth cookies from login rewrites are sent.
  if (typeof window !== "undefined") {
    return normalized;
  }
  const base = getApiBaseUrl();
  return base ? `${base}${normalized}` : normalized;
}
