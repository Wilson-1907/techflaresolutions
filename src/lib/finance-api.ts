import { NextRequest, NextResponse } from "next/server";

export function verifyFinanceApiKey(req: NextRequest): boolean {
  const expected = process.env.FINANCE_API_KEY?.trim();
  if (!expected) return false;
  return req.headers.get("x-finance-api-key") === expected;
}
export function isTrustedFinanceRequest(req: NextRequest): boolean {
  return verifyFinanceApiKey(req);
}

export function financeUnauthorized() {
  return NextResponse.json({ error: "Invalid or missing finance API key" }, { status: 401 });
}
