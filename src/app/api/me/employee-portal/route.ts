import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("projectId");
    const path = projectId
      ? `/api/me/employee-portal?projectId=${encodeURIComponent(projectId)}`
      : "/api/me/employee-portal";
    const upstream = await proxyToBackend(path, { req });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Employee portal unavailable";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.text();
    const upstream = await proxyToBackend("/api/me/workflow-actions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body,
      req,
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Action unavailable";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
