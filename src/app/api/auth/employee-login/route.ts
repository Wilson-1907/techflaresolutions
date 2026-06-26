import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";
import { setAuthCookieOnResponse } from "@/lib/auth-cookie";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const upstream = await proxyToBackend("/api/auth/employee-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      req,
    });
    const text = await upstream.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Employee login unavailable" }, { status: 502 });
    }
    const response = NextResponse.json(data, { status: upstream.status });
    if (upstream.ok && typeof data.token === "string") {
      setAuthCookieOnResponse(response, data.token);
    }
    return response;
  } catch {
    return NextResponse.json({ error: "Employee login unavailable" }, { status: 503 });
  }
}
