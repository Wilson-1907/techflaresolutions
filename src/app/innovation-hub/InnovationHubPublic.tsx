import Link from "next/link";
import { InnovationWorkflowSteps } from "@/components/innovation/InnovationWorkflowSteps";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Lightbulb, LogIn, UserPlus } from "lucide-react";
import { SITE_LABELS } from "@/lib/site-vs-portal";

/** Public info page only — signed-in members are redirected to their workspace. */
export function InnovationHubPublic() {
  return (
    <>
      <PageHeader
        badge="Public"
        title="Innovation program"
        subtitle="Learn how TechFlare supports inventors — your actual submissions happen in your private workspace after sign-in"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10">
            <InnovationWorkflowSteps />
          </div>

          <GlassCard className="max-w-2xl mx-auto text-center border-gold/25 py-12 px-6">
            <Lightbulb className="h-12 w-12 text-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">This page is information only</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The {SITE_LABELS.innovationProgram} explains our pipeline. To submit an idea, pay for AI coaching, or
              track progress, sign in and open your <strong className="text-foreground">innovator workspace</strong> —
              not this public website.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/login?redirect=/portal/innovation">
                <LogIn className="h-4 w-4" />
                Sign in to workspace
              </Button>
              <Button href="/register" variant="outline">
                <UserPlus className="h-4 w-4" />
                Create innovator account
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              <Link href="/blog" className="text-gold hover:underline">
                Company blog
              </Link>
              {" · "}
              <Link href="/" className="text-gold hover:underline">
                Back to website
              </Link>
            </p>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
