import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-guard";
import { rateLimit, validateOrigin } from "@/lib/security";
import { z } from "zod";

const schema = z.object({
  problem: z.string().min(20),
  budget: z.string().min(1),
  industry: z.string().min(1),
  timeline: z.string().min(1),
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10, 60_000);
  if (limited) return limited;
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    if (body.website) return NextResponse.json({ error: "Rejected" }, { status: 400 });

    const data = schema.parse(body);

    const solution = await prisma.solutionRequest.create({
      data: {
        problem: data.problem,
        budget: data.budget,
        industry: data.industry,
        timeline: data.timeline,
        userId: auth.user.id,
        guestName: `${auth.user.firstName} ${auth.user.lastName}`,
        guestEmail: auth.user.email,
      },
    });

    return NextResponse.json({ id: solution.id, message: "Solution request submitted" });
  } catch {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
