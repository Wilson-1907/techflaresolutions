import { Metadata } from "next";
import { SolutionsClient } from "./SolutionsClient";

export const metadata: Metadata = {
  title: "Solutions Center — Solve Your Problem",
  description:
    "Describe your business problem and TechFlare Solutions will research and propose tailored technology solutions with AI-assisted proposals.",
  keywords: ["custom software solutions Kenya", "TechFlare Solutions Center", "AI proposal"],
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "TechFlare Solutions Center",
    description: "Bring us your problem — we research and propose world-class solutions.",
    url: "/solutions",
  },
  robots: { index: true, follow: true },
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
