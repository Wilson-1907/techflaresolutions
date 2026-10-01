import { NextRequest, NextResponse } from "next/server";
import { rateLimit, validateOrigin } from "@/lib/security";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["CLIENT", "INNOVATOR"]).default("CLIENT"),
  company: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60 * 60_000);
  if (limited) return limited;

  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        company: data.company,
      },
    });

    return NextResponse.json({
      message: "Account created successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
