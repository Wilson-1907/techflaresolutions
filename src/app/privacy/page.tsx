import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" badge="Legal" />
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <GlassCard>
            <p className="text-muted-foreground leading-relaxed">
              TechFlare Solutions is committed to protecting your privacy. We collect only the information
              necessary to provide our services, process idea submissions, and communicate with clients.
              Sensitive personal data and submissions are encrypted at rest using AES-256 encryption.
              Passwords are securely hashed. All traffic uses HTTPS. We do not sell personal information to third parties.
            </p>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
