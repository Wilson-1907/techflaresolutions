import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateScopeFromDescription } from "@/lib/scope-generator";
import { z } from "zod";

const STAFF_ROLES = new Set(["HOD", "ADMIN", "CIO", "EMPLOYEE"]);
const schema = z.object({ projectDescription: z.string().min(10).max(8000) });

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !STAFF_ROLES.has(session.role)) {
    return NextResponse.json({ error: "Staff access required" }, { status: 403 });
  }
  try {
    const body = schema.parse(await req.json());
    const result = await generateScopeFromDescription(body.projectDescription);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Describe the project in a few sentences." }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Could not generate scope";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
