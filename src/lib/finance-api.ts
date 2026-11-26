import { NextRequest, NextResponse } from "next/server";
import { timingSafeStringEqual } from "@/lib/security";

export function verifyFinanceApiKey(req: NextRequest): boolean {
  const expected = process.env.FINANCE_API_KEY?.trim();
  if (!expected) return false;
  const provided = req.headers.get("x-finance-api-key")?.trim() || "";
  if (!provided) return false;
  return timingSafeStringEqual(provided, expected);
}

export function isTrustedFinanceRequest(req: NextRequest): boolean {
  return verifyFinanceApiKey(req);
}

export function financeUnauthorized() {
  return NextResponse.json(
    { error: "Invalid or missing finance API key" },
    { status: 401, headers: { "Cache-Control": "no-store" } }
  );
}
