import { NextRequest, NextResponse } from "next/server";
import { timingSafeStringEqual } from "@/lib/security";

export function verifyAdminApiKey(req: NextRequest): boolean {
  const expected = process.env.ADMIN_API_KEY?.trim();
  if (!expected) return false;
  const provided = req.headers.get("x-admin-api-key")?.trim() || "";
  if (!provided) return false;
  return timingSafeStringEqual(provided, expected);
}

/** Trusted server-to-server calls from the admin panel (valid API key). */
export function isTrustedAdminRequest(req: NextRequest): boolean {
  return verifyAdminApiKey(req);
}

export function adminUnauthorized() {
  return NextResponse.json(
    { error: "Invalid or missing admin API key" },
    { status: 401, headers: { "Cache-Control": "no-store" } }
  );
}
