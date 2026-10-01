import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.SEED_DEMO_DATA !== "true") {
    console.log("Skipping demo seed in production. Set SEED_DEMO_DATA=true to run.");
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@techflaresolutions.com" },
    update: {},
    create: {
      email: "admin@techflaresolutions.com",
      passwordHash,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      email: "client@example.com",
      passwordHash: await bcrypt.hash("client123", 12),
      firstName: "John",
      lastName: "Client",
      role: "CLIENT",
      company: "Acme Corp",
    },
  });

  const innovator = await prisma.user.upsert({
    where: { email: "innovator@example.com" },
    update: {},
    create: {
      email: "innovator@example.com",
      passwordHash: await bcrypt.hash("innovator123", 12),
      firstName: "Jane",
      lastName: "Innovator",
      role: "INNOVATOR",
    },
  });

  const existingProject = await prisma.project.findFirst({
    where: { name: "E-Learning Platform", clientId: client.id },
  });

  const project =
    existingProject ||
    (await prisma.project.create({
      data: {
        name: "E-Learning Platform",
        description: "Custom LMS for Acme Corp",
        status: "IN_PROGRESS",
        progress: 72,
        clientId: client.id,
        milestones: {
          create: [
            { title: "Requirements Gathering", completed: true },
            { title: "UI/UX Design", completed: true },
            { title: "Backend Development", completed: true, dueDate: new Date() },
            { title: "Testing & QA", completed: false },
          ],
        },
        invoices: {
          create: [
            {
              number: "INV-2026-001",
              amount: 25000,
              status: "paid",
              dueDate: new Date("2026-03-01"),
            },
            {
              number: "INV-2026-042",
              amount: 15000,
              status: "pending",
              dueDate: new Date("2026-07-01"),
            },
          ],
        },
      },
    }));

  await prisma.idea.create({
    data: {
      title: "AI-Powered Crop Disease Detector",
      description: "Using computer vision to detect crop diseases early via smartphone camera.",
      category: "agriculture",
      type: "invention",
      status: "FEASIBILITY_ANALYSIS",
      userId: innovator.id,
    },
  });

  const newsItems = [
    {
      title: "TechFlare Solutions Expands Innovation Offices in Kenya",
      slug: "techflare-expands-innovation-offices-kenya",
      category: "announcement",
      excerpt:
        "TechFlare Solutions strengthens its Kenya presence with offices in Karatina and Nyeri, supporting innovators across East Africa.",
      content:
        "TechFlare Solutions is proud to announce expanded physical and online operations in Kenya. Our Karatina and Nyeri offices will serve as innovation hubs for research, client partnerships, and community programs.\n\nJoin our WhatsApp community and submit your ideas through the Innovation Hub on our main website.",
      authorName: "TechFlare Solutions Communications",
      published: true,
    },
    {
      title: "Innovation Hub Milestone: 100+ Ideas Submitted",
      slug: "innovation-hub-100-ideas",
      category: "achievement",
      excerpt:
        "Our Innovation Hub has received over 100 ideas from innovators, businesses, and researchers worldwide.",
      content:
        "We celebrate a major milestone as innovators trust TechFlare Solutions to research, validate, and build their concepts. From agriculture to fintech, every submission moves us closer to Flaring Up the Future with Lines of Codes.",
      authorName: "Innovation Team",
      published: true,
    },
  ];

  for (const item of newsItems) {
    await prisma.newsArticle.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  console.log("Seed completed:", { admin: admin.email, client: client.email, innovator: innovator.email, project: project.name });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
