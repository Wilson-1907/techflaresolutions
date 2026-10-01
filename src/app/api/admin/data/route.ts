import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminApiKey, adminUnauthorized } from "@/lib/admin-api";
import type { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  if (!verifyAdminApiKey(req)) return adminUnauthorized();

  const type = req.nextUrl.searchParams.get("type") || "overview";

  try {
    switch (type) {
      case "overview":
        return NextResponse.json(await getOverview());
      case "ideas":
        return NextResponse.json({
          items: await prisma.idea.findMany({
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        });
      case "solutions":
        return NextResponse.json({
          items: await prisma.solutionRequest.findMany({
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        });
      case "users": {
        const roleParam = req.nextUrl.searchParams.get("role") || undefined;
        const roles = roleParam?.split(",").filter(Boolean) as UserRole[] | undefined;
        return NextResponse.json({
          items: await prisma.user.findMany({
            where: roles?.length ? { role: { in: roles } } : undefined,
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              company: true,
              phone: true,
              points: true,
              communityMember: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        });
      }
      case "projects":
        return NextResponse.json({
          items: await prisma.project.findMany({
            include: {
              client: { select: { firstName: true, lastName: true, email: true, company: true } },
              invoices: { select: { number: true, amount: true, status: true } },
            },
            orderBy: { updatedAt: "desc" },
            take: 100,
          }),
        });
      case "orders":
        return NextResponse.json({
          items: await prisma.productOrder.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        });
      case "contacts":
        return NextResponse.json({
          items: await prisma.contactSubmission.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        });
      case "careers":
        return NextResponse.json({
          items: await prisma.careerApplication.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        });
      case "tickets":
        return NextResponse.json({
          items: await prisma.supportTicket.findMany({
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { updatedAt: "desc" },
            take: 100,
          }),
        });
      case "community":
        return NextResponse.json({
          items: await prisma.user.findMany({
            where: { communityMember: true },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              communityJoinedAt: true,
              createdAt: true,
            },
            orderBy: { communityJoinedAt: "desc" },
            take: 100,
          }),
        });
      case "news":
        return NextResponse.json({
          items: await prisma.newsArticle.findMany({ orderBy: { publishedAt: "desc" }, take: 100 }),
        });
      default:
        return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

async function getOverview() {
  const [
    clients,
    innovators,
    admins,
    ideas,
    ideasPending,
    solutions,
    projects,
    orders,
    contacts,
    careers,
    tickets,
    newsPublished,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.user.count({ where: { role: "INNOVATOR" } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "EMPLOYEE"] } } }),
    prisma.idea.count(),
    prisma.idea.count({
      where: { status: { in: ["SUBMITTED", "RESEARCH_REVIEW", "RISK_ASSESSMENT", "FEASIBILITY_ANALYSIS"] } },
    }),
    prisma.solutionRequest.count(),
    prisma.project.count({ where: { status: { in: ["PLANNING", "IN_PROGRESS", "REVIEW"] } } }),
    prisma.productOrder.count(),
    prisma.contactSubmission.count(),
    prisma.careerApplication.count(),
    prisma.supportTicket.count({ where: { status: "open" } }),
    prisma.newsArticle.count({ where: { published: true } }),
  ]);

  const pipeline = await prisma.idea.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const recentIdeas = await prisma.idea.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { title: true, status: true, createdAt: true },
  });

  const recentOrders = await prisma.productOrder.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { productTitle: true, customerName: true, status: true, createdAt: true },
  });

  return {
    stats: {
      clients,
      innovators,
      admins,
      ideas,
      ideasPending,
      solutions,
      activeProjects: projects,
      orders,
      contacts,
      careers,
      openTickets: tickets,
      newsPublished,
    },
    pipeline: pipeline.map((p) => ({ status: p.status, count: p._count.status })),
    recentActivity: [
      ...recentIdeas.map((i) => ({
        text: `Idea submitted: ${i.title} (${i.status.replace(/_/g, " ")})`,
        date: i.createdAt,
      })),
      ...recentOrders.map((o) => ({
        text: `Product order: ${o.productTitle} by ${o.customerName}`,
        date: o.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8),
  };
}
