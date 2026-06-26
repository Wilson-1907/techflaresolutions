import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPublicCatalog, getPricedCatalog } from "@/lib/scope-generator";

export async function GET(req: NextRequest) {
  const wantsPriced = req.nextUrl.searchParams.get("priced") === "1";
  if (!wantsPriced) {
    return NextResponse.json(getPublicCatalog());
  }

  const session = await getSession();
  const staffSession = Boolean(session && ["HOD", "ADMIN", "CIO", "EMPLOYEE"].includes(session.role));
  if (!staffSession) {
    return NextResponse.json({ error: "Staff access required for internal rates." }, { status: 403 });
  }

  return NextResponse.json(getPricedCatalog());
}
