import { Metadata } from "next";
import { CareersClient } from "./CareersClient";
import { loadJobPositions } from "@/lib/jobs";
import { SEO_KEYWORDS } from "@/data/seo";

export const metadata: Metadata = {
  title: "Careers — Not Hiring Right Now",
  description:
    "TechFlare Solutions careers. We are not hiring at this time. Join our community for future technology, software, AI, and research roles in Kenya.",
  keywords: [...SEO_KEYWORDS, "careers", "jobs Kenya", "tech jobs", "not hiring"],
  alternates: { canonical: "/careers" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Careers | TechFlare Solutions",
    description: "Not hiring right now — join the community for future openings.",
    url: "/careers",
  },
};

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const positions = await loadJobPositions();
  return <CareersClient positions={positions} />;
}
