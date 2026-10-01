import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Service" badge="Legal" />
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <GlassCard>
            <p className="text-muted-foreground leading-relaxed">
              By using TechFlare Solutions services, you agree to our terms of service.
              Idea submissions through the Innovation Hub are subject to our intellectual property
              review process. Partnership terms are defined in individual agreements.
            </p>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
