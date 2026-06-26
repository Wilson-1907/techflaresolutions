import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(req: NextRequest) {
  try {
    const upstream = await proxyToBackend("/api/auth/me", { method: "GET", req });
    const text = await upstream.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: upstream.status });
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 503 });
  }
}
