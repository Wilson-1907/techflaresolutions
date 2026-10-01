import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader title="Accessibility" subtitle="Committed to WCAG 2.2 compliance" badge="A11y" />
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <GlassCard>
            <p className="text-muted-foreground leading-relaxed">
              TechFlare Solutions is committed to ensuring digital accessibility for people with disabilities.
              We continually improve the user experience for everyone and apply relevant accessibility standards
              including WCAG 2.2 Level AA. If you encounter accessibility barriers, please contact us at
              solutionstechflare@gmail.com.
            </p>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
