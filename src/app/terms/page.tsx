import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { termsSections } from "@/data/policies";
import { company } from "@/data/site";
import { EmailLink } from "@/components/ui/EmailLink";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and Conditions for TechFlare Solutions clients and innovators.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms & Conditions" subtitle="For clients, innovators, and partners" badge="Legal" />
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 space-y-4">
          {termsSections.map((section) => (
            <GlassCard key={section.title}>
              <h2 className="text-lg font-bold text-gold mb-2">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{section.body}</p>
            </GlassCard>
          ))}
          <p className="text-center text-sm text-muted-foreground pt-4">
            Questions?{" "}
            <EmailLink context={{ type: "general", label: "Terms & Conditions question" }} className="text-gold hover:underline">
              {company.email}
            </EmailLink>
          </p>
        </div>
      </section>
    </>
  );
}
