/**
 * Clean production-ready seed: admin account only (no demo clients, money, or fake projects).
 * Usage: npx tsx prisma/seed-clean.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_SEED_PASSWORD || "ChangeMeAdmin123!";
  const email = process.env.ADMIN_SEED_EMAIL || "admin@techflare-solutions.com";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email,
      passwordHash,
      firstName: "TechFlare",
      lastName: "Admin",
      role: "ADMIN",
    },
  });

  console.log(`Clean admin ready: ${email}`);
  console.log("Change the password after first login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
