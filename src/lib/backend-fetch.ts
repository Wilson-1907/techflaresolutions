import { getApiBaseUrl, PRODUCTION_BACKEND } from "./api-base";

/** Headers so SSR and API route proxies pass backend bot checks. */
const SSR_HEADERS: HeadersInit = {
  Accept: "application/json",
  "Accept-Language": "en-KE,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (compatible; TechFlare-Site/1.0; +https://techflare-solutions.com)",
};

export function getBackendUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = (getApiBaseUrl() || PRODUCTION_BACKEND).replace(/\/$/, "");
  return `${base}${normalized}`;
}

export async function serverBackendFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  for (const [key, value] of Object.entries(SSR_HEADERS)) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return fetch(getBackendUrl(path), {
    ...init,
    cache: "no-store",
    headers,
    next: { revalidate: 0 },
  });
}
