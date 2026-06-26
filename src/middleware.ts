import { NextRequest, NextResponse } from "next/server";
import { rateLimit, isBotOrScraper, applySecurityHeaders } from "@/lib/security";
import { getAdminPanelUrl } from "@/lib/env";
import { isTrustedAdminRequest } from "@/lib/admin-api";
import { isTrustedFinanceRequest } from "@/lib/finance-api";

const protectedPages = ["/portal"];
const publicAssetPaths = ["/_next/static", "/_next/image", "/favicon.ico", "/logo.png", "/icon.png", "/robots.txt"];

function isTrustedServiceRequest(req: NextRequest) {
  return isTrustedAdminRequest(req) || isTrustedFinanceRequest(req);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const trustedService = isTrustedServiceRequest(req);

  if (pathname === "/api/health") {
    return applySecurityHeaders(NextResponse.next());
  }

  if (!publicAssetPaths.some((p) => pathname.startsWith(p)) && !trustedService) {
    if (isBotOrScraper(req)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  if (pathname.startsWith("/api") && !trustedService) {
    const limited = rateLimit(req, 120, 60_000);
    if (limited) return limited;
  } else if (!publicAssetPaths.some((p) => pathname.startsWith(p)) && !trustedService) {
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
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);

  if (pathname.startsWith("/api")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png|icon.png|robots.txt).*)"],
};
