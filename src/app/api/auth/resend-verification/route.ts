import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const upstream = await proxyToBackend("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      req,
    });
    const text = await upstream.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: upstream.status });
    } catch {
      return NextResponse.json({ error: "Could not resend verification code" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Verification service unavailable" }, { status: 503 });
  }
}
