import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const upstream = await proxyToBackend(`/api/payments/invoice/${id}`, { req: _req });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
