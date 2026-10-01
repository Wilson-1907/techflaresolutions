import { NextResponse } from "next/server";
import { getSession, type AuthUser } from "./auth";

export async function requireAuth(): Promise<{ user: AuthUser } | NextResponse> {
  const user = await getSession();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required. Please sign in to continue.", code: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }
  return { user };
}

export async function requireCommunityMember(): Promise<
  { user: AuthUser & { communityMember: boolean } } | NextResponse
> {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;

  const { prisma } = await import("./db");
  const full = await prisma.user.findUnique({
    where: { id: result.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      communityMember: true,
    },
  });

  if (!full) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  if (!full.communityMember) {
    return NextResponse.json(
      {
        error: "Community membership required. Join our WhatsApp community first.",
        code: "COMMUNITY_REQUIRED",
      },
      { status: 403 }
    );
  }

  return { user: full };
}
