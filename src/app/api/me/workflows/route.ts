import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

async function readUpstreamJson(upstream: Response) {
  const text = await upstream.text();
  if (!text.trim()) {
    return upstream.ok
      ? {}
      : { error: upstream.status === 401 ? "Please sign in again." : `Request failed (${upstream.status})` };
  }
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { error: "Invalid response from server" };
  }
}

export async function GET(req: NextRequest) {
  const upstream = await proxyToBackend("/api/me/workflows", { method: "GET", req, withAuth: true });
  const data = await readUpstreamJson(upstream);
  return NextResponse.json(data, { status: upstream.status });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const upstream = await proxyToBackend("/api/me/workflows", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    req,
    withAuth: true,
  });
  const data = await readUpstreamJson(upstream);
  return NextResponse.json(data, { status: upstream.status });
}
