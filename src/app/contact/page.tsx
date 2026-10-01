import { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact TechFlare Solutions",
  description:
    "Contact TechFlare Solutions in Kenya — Karatina & Nyeri offices. Email solutionstechflare@gmail.com or call +254 769227291.",
  keywords: ["contact TechFlare Solutions", "TechFlare Solutions Kenya", "Karatina", "Nyeri"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact TechFlare Solutions",
    description: "Reach TechFlare Solutions — offices in Karatina and Nyeri, Kenya.",
    url: "/contact",
  },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return <ContactClient />;
}
