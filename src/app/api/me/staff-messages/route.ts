import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(req: NextRequest) {
  const upstream = await proxyToBackend("/api/me/staff-messages", { req });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const upstream = await proxyToBackend("/api/me/staff-messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    req,
  });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
