import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const upstream = await proxyToBackend(`/api/payments/mpesa/${id}`, { req });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
