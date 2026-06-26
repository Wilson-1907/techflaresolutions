import { NextResponse } from "next/server";
import { serverBackendFetch } from "@/lib/backend-fetch";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await serverBackendFetch("/api/jobs");
    const text = await res.text();
    if (!text.trim()) {
      return NextResponse.json(
        { error: "Empty jobs response from backend" },
        { status: res.ok ? 502 : res.status }
      );
    }
    let data: { jobs?: unknown[] };
    try {
      data = JSON.parse(text) as { jobs?: unknown[] };
    } catch {
      return NextResponse.json(
        { error: "Invalid jobs response from backend" },
        { status: 502 }
      );
    }
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (e) {
    console.error("jobs proxy:", e);
    return NextResponse.json({ error: "Could not load jobs" }, { status: 502 });
  }
}
