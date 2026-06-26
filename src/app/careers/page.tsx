import { Metadata } from "next";
import { CareersClient } from "./CareersClient";
import { loadJobPositions } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join TechFlare Solutions. Community membership required to apply.",
};

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const positions = await loadJobPositions();
  return <CareersClient positions={positions} />;
}
