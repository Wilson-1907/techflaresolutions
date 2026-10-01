/**
 * Wipe all application data from the database (keeps schema).
 * Usage: npx tsx prisma/wipe.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Wiping TechFlare Solutions database...");

  // Delete in FK-safe order
  await prisma.pointsTransaction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.document.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.productOrder.deleteMany();
  await prisma.careerApplication.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.solutionRequest.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.researchPublication.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database wiped clean. No users, invoices, projects, or demo records remain.");
  console.log("Create a fresh admin account via seed (dev) or registration.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
