import { Suspense } from "react";
import { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with TechFlare Solutions. Email, call, SMS, WhatsApp, and social links.",
};

export default function ContactPage() {
  return (
    <Suspense fallback={<p className="text-center py-24 text-muted-foreground">Loading contact...</p>}>
      <ContactClient />
    </Suspense>
  );
}
