import { NextRequest, NextResponse } from "next/server";
import {
  isBotOrScraper,
  isSearchEngineBot,
  applySecurityHeaders,
  resolveRateBand,
  rateLimitBand,
  requireTrustedMutation,
  looksLikeSessionToken,
} from "@/lib/security";
import { getAdminPanelUrl } from "@/lib/env";
import { isTrustedAdminRequest } from "@/lib/admin-api";
import { isTrustedFinanceRequest } from "@/lib/finance-api";

const protectedPages = ["/portal"];
const publicAssetPaths = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/logo.png",
  "/icon.png",
  "/robots.txt",
  "/sitemap.xml",
  "/site.webmanifest",
];

function isTrustedServiceRequest(req: NextRequest) {
  return isTrustedAdminRequest(req) || isTrustedFinanceRequest(req);
}

function isPublicAsset(pathname: string) {
  return publicAssetPaths.some((p) => pathname === p || pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const trustedService = isTrustedServiceRequest(req);
  const searchBot = isSearchEngineBot(req);
  const method = req.method.toUpperCase();

  if (pathname === "/api/health") {
    return applySecurityHeaders(NextResponse.next(), { pathname });
  }

  // Block scrapers / empty UAs on app + API (search engines allowed).
  if (!isPublicAsset(pathname) && !trustedService && !searchBot) {
    if (isBotOrScraper(req)) {
      return applySecurityHeaders(new NextResponse("Forbidden", { status: 403 }), {
        pathname,
      });
    }
  }

  // Rate bands — never throttle Google/Bing crawlers.
  if (!searchBot && !trustedService && !isPublicAsset(pathname)) {
    const band = resolveRateBand(pathname, method);
    const limited = rateLimitBand(req, band);
    if (limited) return applySecurityHeaders(limited, { pathname });
  }

  // CSRF-ish origin band for browser mutations on API routes.
  if (pathname.startsWith("/api") && !trustedService) {
    const blocked = requireTrustedMutation(req);
    if (blocked) return applySecurityHeaders(blocked, { pathname });
  }

  if (pathname.startsWith("/portal/admin")) {
    return NextResponse.redirect(`${getAdminPanelUrl()}/dashboard`);
  }

  if (protectedPages.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("auth_token")?.value;
    if (!looksLikeSessionToken(token)) {
      const login = new URL("/login", req.url);
      login.searchParams.set("redirect", pathname);
      const redirect = NextResponse.redirect(login);
      return applySecurityHeaders(redirect, { pathname: "/login" });
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response, { pathname });

  if (pathname.startsWith("/api") || pathname.startsWith("/portal")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|icon.png|robots.txt|sitemap.xml|site.webmanifest).*)",
  ],
};
