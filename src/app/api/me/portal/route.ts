import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(req: NextRequest) {
  try {
    const upstream = await proxyToBackend("/api/me/portal", { method: "GET", req, withAuth: true });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Portal service unavailable" }, { status: 503 });
  }
}
