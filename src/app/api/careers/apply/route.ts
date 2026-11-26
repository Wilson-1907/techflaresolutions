import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Sign in required before applying for careers." },
      { status: 401 }
    );
  }

  if (!session.communityMember) {
    return NextResponse.json(
      {
        error:
          "Join the TechFlare Solutions WhatsApp community and confirm membership at /community before applying.",
        code: "COMMUNITY_REQUIRED",
      },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid application payload." }, { status: 400 });
  }

  if (body.communityConfirmed !== true) {
    return NextResponse.json(
      { error: "Confirm community membership before submitting an application." },
      { status: 403 }
    );
  }

  try {
    const upstream = await proxyToBackend("/api/careers/apply", {
      method: "POST",
      req,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        communityConfirmed: true,
        applicantEmail: typeof body.applicantEmail === "string" ? body.applicantEmail : session.email,
      }),
    });
    const text = await upstream.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: upstream.status });
    } catch {
      return NextResponse.json(
        { error: text || "Application failed" },
        { status: upstream.status || 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Could not submit application. Try again shortly." },
      { status: 503 }
    );
  }
}
