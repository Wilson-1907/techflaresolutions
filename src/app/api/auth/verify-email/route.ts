import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";
import { setAuthCookieOnResponse } from "@/lib/auth-cookie";

function jsonFromUpstream(upstream: Response) {
  return upstream.text().then((text) => {
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return null;
    }
  });
}

function withSessionCookie(response: NextResponse, upstream: Response, data: Record<string, unknown>) {
  if (upstream.ok && typeof data.token === "string") {
    setAuthCookieOnResponse(response, data.token);
  }
  return response;
}

export async function GET(req: NextRequest) {
  try {
    const qs = req.nextUrl.searchParams.toString();
    const upstream = await proxyToBackend(`/api/auth/verify-email?${qs}`, { method: "GET", req });
    const data = await jsonFromUpstream(upstream);
    if (!data) {
      return NextResponse.json({ error: "Verification service unavailable" }, { status: 502 });
    }
    return withSessionCookie(NextResponse.json(data, { status: upstream.status }), upstream, data);
  } catch {
    return NextResponse.json({ error: "Verification service unavailable" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const upstream = await proxyToBackend("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      req,
    });
    const data = await jsonFromUpstream(upstream);
    if (!data) {
      return NextResponse.json({ error: "Verification service unavailable" }, { status: 502 });
    }
    return withSessionCookie(NextResponse.json(data, { status: upstream.status }), upstream, data);
  } catch {
    return NextResponse.json({ error: "Verification service unavailable" }, { status: 503 });
  }
}
