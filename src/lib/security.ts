import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

const buckets = new Map<string, { count: number; resetAt: number }>();

/** Always allow major search engines — required for Google sitelinks & indexing. */
const SEARCH_ENGINE_BOTS = [
  "googlebot",
  "google-inspectiontool",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "applebot",
  "facebot",
  "twitterbot",
  "linkedinbot",
];

const SCRAPER_AGENTS = [
  "scrapy",
  "curl/",
  "wget/",
  "python-requests",
  "python-urllib",
  "aiohttp",
  "httpclient",
  "libwww",
  "httrack",
  "ia_archiver",
  "semrush",
  "ahrefsbot",
  "mj12bot",
  "dotbot",
  "petalbot",
  "bytespider",
  "gptbot",
  "claudebot",
  "anthropic",
  "ccbot",
  "dataforseo",
  "serpstat",
  "panscient",
  "extractor",
  "headlesschrome",
  "phantomjs",
  "selenium",
  "puppeteer",
  "playwright",
  "webzip",
  "sitesucker",
  "webcopier",
  "teleport",
  "offline explorer",
  "go-http-client",
  "java/",
  "apache-httpclient",
  "okhttp",
  "node-fetch",
  "undici",
  "postmanruntime",
  "insomnia",
  "httpie",
  "rest-client",
  "masscan",
  "nikto",
  "sqlmap",
  "nmap",
  "zgrab",
  "nuclei",
];

export type RateBand = "auth" | "api" | "page" | "write";

const RATE_BANDS: Record<RateBand, { limit: number; windowMs: number }> = {
  auth: { limit: 12, windowMs: 60_000 },
  write: { limit: 40, windowMs: 60_000 },
  api: { limit: 90, windowMs: 60_000 },
  page: { limit: 160, windowMs: 60_000 },
};

export function isSearchEngineBot(req: NextRequest): boolean {
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  return SEARCH_ENGINE_BOTS.some((b) => ua.includes(b));
}

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimit(
  req: NextRequest,
  limit = 60,
  windowMs = 60_000,
  bucketKey?: string
): NextResponse | null {
  const ip = clientIp(req);
  const path = new URL(req.url).pathname;
  const key = bucketKey || `${ip}:${path}`;
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count += 1;
  if (entry.count > limit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": String(limit),
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return null;
}

export function rateLimitBand(req: NextRequest, band: RateBand): NextResponse | null {
  const cfg = RATE_BANDS[band];
  const ip = clientIp(req);
  return rateLimit(req, cfg.limit, cfg.windowMs, `${band}:${ip}`);
}

export function resolveRateBand(pathname: string, method: string): RateBand {
  const mutating = !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
  if (pathname.startsWith("/api/auth")) return "auth";
  if (pathname.startsWith("/api") && mutating) return "write";
  if (pathname.startsWith("/api")) return "api";
  return "page";
}

export function isBotOrScraper(req: NextRequest): boolean {
  if (isSearchEngineBot(req)) return false;

  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  if (!ua || ua.length < 12) return true;
  if (SCRAPER_AGENTS.some((b) => ua.includes(b))) return true;

  const suspiciousHeaders =
    !req.headers.get("accept-language") &&
    !req.headers.get("sec-fetch-site") &&
    !req.headers.get("sec-fetch-mode");

  if (suspiciousHeaders && req.method === "GET" && !ua.includes("mozilla")) {
    return true;
  }

  return false;
}

function allowedHosts(): Set<string> {
  const hosts = new Set<string>();
  for (const raw of [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_ADMIN_PANEL_URL,
    process.env.NEXT_PUBLIC_FINANCE_PANEL_URL,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
  ]) {
    if (!raw?.trim()) continue;
    try {
      hosts.add(new URL(raw.trim()).host.toLowerCase());
    } catch {
      /* ignore */
    }
  }
  return hosts;
}

function isTrustedHost(hostname: string, requestHost?: string | null): boolean {
  const h = hostname.toLowerCase();
  if (requestHost && h === requestHost.toLowerCase()) return true;
  if (allowedHosts().has(h)) return true;
  // Vercel preview / production app hosts
  if (h.endsWith(".vercel.app")) return true;
  const bare = h.split(":")[0];
  if (bare === "localhost" || bare === "127.0.0.1") return true;
  return false;
}

/** Same-site / trusted-panel origin check for browser mutations. */
export function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin) {
    // Non-browser clients may omit Origin; require a same-host Referer.
    const referer = req.headers.get("referer");
    if (!referer) return false;
    try {
      const refHost = new URL(referer).host;
      return isTrustedHost(refHost, host);
    } catch {
      return false;
    }
  }
  try {
    const originHost = new URL(origin).host;
    return isTrustedHost(originHost, host);
  } catch {
    return false;
  }
}

export function requireTrustedMutation(req: NextRequest): NextResponse | null {
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return null;
  if (validateOrigin(req)) return null;
  return NextResponse.json(
    { error: "Forbidden origin. Refresh the page and try again." },
    { status: 403, headers: { "Cache-Control": "no-store" } }
  );
}

/** Reject obviously malformed session tokens before portal access. */
export function looksLikeSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  if (token.length < 20 || token.length > 4096) return false;
  // JWT (3 parts) or opaque bearer-like token
  if (token.includes(".")) {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    return parts.every((p) => p.length > 0 && /^[A-Za-z0-9_-]+$/.test(p));
  }
  return /^[A-Za-z0-9_-]+$/.test(token);
}

export function timingSafeStringEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Still compare to reduce timing variance on length leaks for short secrets.
      const fill = Buffer.alloc(bufA.length);
      timingSafeEqual(bufA, fill);
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function applySecurityHeaders(
  response: NextResponse,
  opts?: { pathname?: string }
): NextResponse {
  const pathname = opts?.pathname || "";
  const isPrivate = pathname.startsWith("/api") || pathname.startsWith("/portal");

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), display-capture=(), payment=(), usb=(), interest-cohort=()"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", isPrivate ? "same-origin" : "cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");

  // Public pages: allow Google snippets/sitelinks. Private routes: noindex.
  if (isPrivate) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noai, noimageai");
  } else {
    response.headers.set("X-Robots-Tag", "noai, noimageai");
  }

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self' mailto:",
      "object-src 'none'",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.vercel-storage.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Next.js requires inline/eval in some runtimes; keep scripts same-origin + inline for hydration.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' https: wss:",
      "media-src 'self' blob:",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join("; ")
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return response;
}
