import { NextRequest, NextResponse } from "next/server";

export function verifyAdminApiKey(req: NextRequest): boolean {
  const expected = process.env.ADMIN_API_KEY?.trim();
  if (!expected) return false;
  return req.headers.get("x-admin-api-key") === expected;
}

/** Trusted server-to-server calls from the admin panel (valid API key). */
export function isTrustedAdminRequest(req: NextRequest): boolean {
  return verifyAdminApiKey(req);
}

export function adminUnauthorized() {
  return NextResponse.json({ error: "Invalid or missing admin API key" }, { status: 401 });
}
