import { NextRequest, NextResponse } from "next/server";
import {
  rateLimit,
  isBotOrScraper,
  isSearchEngineBot,
  applySecurityHeaders,
} from "@/lib/security";
import { getAdminPanelUrl } from "@/lib/env";
import { verifyAuthCookie } from "@/lib/jwt-edge";
import { isTrustedAdminRequest } from "@/lib/admin-api";

const protectedPages = ["/portal"];
const publicAssetPaths = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/logo.png",
  "/icon.png",
  "/robots.txt",
  "/sitemap.xml",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const trustedAdmin = isTrustedAdminRequest(req);
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const searchBot = isSearchEngineBot(ua);

  // Let Google/Bing crawl freely — no scraper block, no rate limit
  if (searchBot) {
    const response = NextResponse.next();
    applySecurityHeaders(response, { allowIndexing: true });
    return response;
  }

  if (pathname === "/api/health") {
    return applySecurityHeaders(NextResponse.next());
  }

  if (!publicAssetPaths.some((p) => pathname.startsWith(p)) && !trustedAdmin) {
    if (isBotOrScraper(req)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  if (pathname.startsWith("/api") && !trustedAdmin) {
    const limited = rateLimit(req, 120, 60_000);
    if (limited) return limited;
  } else if (!publicAssetPaths.some((p) => pathname.startsWith(p)) && !trustedAdmin) {
    const limited = rateLimit(req, 180, 60_000);
    if (limited) return limited;
  }

  if (pathname.startsWith("/portal/admin")) {
    return NextResponse.redirect(`${getAdminPanelUrl()}/dashboard`);
  }

  if (protectedPages.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const login = new URL("/login", req.url);
      login.searchParams.set("redirect", pathname);
      return NextResponse.redirect(login);
    }

    const payload = await verifyAuthCookie(token);
    if (!payload) {
      const login = new URL("/login", req.url);
      login.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(login);
      response.cookies.delete("auth_token");
      return response;
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);

  if (pathname.startsWith("/api")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png|icon.png|robots.txt|sitemap.xml).*)"],
};
