import { Suspense } from "react";
import { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Technology & Software Inquiries",
  description:
    "Contact TechFlare Solutions for technology, research, software, AI, automation, POS, and idea-to-product projects in Kenya.",
  keywords: [
    "contact TechFlare Solutions",
    "technology",
    "software",
    "AI",
    "automation",
    "research",
    "Kenya",
  ],
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <Suspense fallback={<p className="text-center py-24 text-muted-foreground">Loading contact...</p>}>
      <ContactClient />
    </Suspense>
  );
}
