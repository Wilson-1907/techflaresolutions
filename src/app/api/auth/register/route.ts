import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const upstream = await proxyToBackend("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      req,
    });
    const text = await upstream.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: upstream.status });
    } catch {
      const snippet = text.trim().slice(0, 120);
      return NextResponse.json(
        {
          error:
            snippet.includes("DNS") || snippet.includes("hostname")
              ? "Backend URL misconfigured on Vercel. Set NEXT_PUBLIC_API_URL to https://techflaresolutionsback.onrender.com"
              : "Registration service unavailable",
        },
        { status: 502 }
      );
    }
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    const isConfig =
      err instanceof Error &&
      /NEXT_PUBLIC_API_URL|BACKEND_URL|backend deployment/i.test(err.message);
    return NextResponse.json(
      {
        error: isTimeout
          ? "Registration timed out. Your account may have been created — open the OTP page or try signing in."
          : isConfig
            ? "Backend URL not set on Vercel. Add NEXT_PUBLIC_API_URL=https://techflaresolutionsback.onrender.com"
            : "Registration service unavailable. Check that the backend is running on Render.",
      },
      { status: 503 }
    );
  }
}
