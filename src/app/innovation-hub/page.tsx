import { Metadata } from "next";
import { InnovationHubClient } from "./InnovationHubClient";

export const metadata: Metadata = {
  title: "Innovation Hub — Submit Ideas & Inventions",
  description:
    "TechFlare Solutions Innovation Hub: submit ideas, inventions, and business concepts. We research, validate, and build world-class technology solutions.",
  keywords: [
    "Innovation Hub Kenya",
    "submit invention",
    "idea validation",
    "TechFlare Solutions Innovation Hub",
  ],
  alternates: { canonical: "/innovation-hub" },
  openGraph: {
    title: "TechFlare Solutions Innovation Hub",
    description: "Submit your idea or invention — we research, validate, and build it.",
    url: "/innovation-hub",
  },
  robots: { index: true, follow: true },
};

export default function InnovationHubPage() {
  return <InnovationHubClient />;
}
