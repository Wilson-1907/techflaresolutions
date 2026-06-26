import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";
import { setAuthCookieOnResponse } from "@/lib/auth-cookie";

function attachSessionCookie(response: NextResponse, upstream: Response, data: Record<string, unknown>) {
  if (!upstream.ok) return;
  if (typeof data.token === "string") {
    setAuthCookieOnResponse(response, data.token);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const upstream = await proxyToBackend("/api/auth/login", {
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
      const snippet = text.trim().slice(0, 80);
      return NextResponse.json(
        {
          error: snippet === "Forbidden"
            ? "Login blocked by server security. Please refresh and try again."
            : "Login service unavailable. Backend returned an invalid response.",
        },
        { status: upstream.status >= 400 ? upstream.status : 502 }
      );
    }
    const response = NextResponse.json(data, { status: upstream.status });
    attachSessionCookie(response, upstream, data);
    return response;
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      {
        error: isTimeout
          ? "Login timed out. The server may be waking up — try again in 30 seconds."
          : "Login service unavailable. Check that the backend is running on Render.",
      },
      { status: 503 }
    );
  }
}
