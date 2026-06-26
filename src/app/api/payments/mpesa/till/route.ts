import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(req: NextRequest) {
  const upstream = await proxyToBackend("/api/payments/mpesa/till", { req });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
