import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const upstream = await proxyToBackend("/api/me/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      req,
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Rating service unavailable" }, { status: 503 });
  }
}
