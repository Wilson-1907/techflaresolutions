"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Lightbulb, FolderKanban, Loader2 } from "lucide-react";
import { usePortalData, formatPortalDate, statusBadge } from "./usePortalData";
import { QuickRevisionPanel } from "./QuickRevisionPanel";
import { ScheduleProgressBar } from "./ScheduleProgressBar";
import { ideaStatusToSteps } from "@/lib/schedule-progress";
import {
  parseWorkflowStages,
  progressFromStages,
  shouldShowWorkflowProgress,
  workflowStagesToScheduleSteps,
} from "@/lib/workflow-stages";
import { InnovatorIdeaForm } from "./PortalSubmitForms";
import { PortalTestimonialForm } from "./PortalTestimonialForm";
import { IdeaAiCoach } from "@/components/innovation/IdeaAiCoach";
import { reviewSla } from "@/data/policies";
import { ClientWorkflowsPanel } from "./ClientWorkflowsPanel";

export function InnovatorDashboardView() {
  const { data, loading, error } = usePortalData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <GlassCard className="text-center py-12">
        <p className="text-muted-foreground">{error || "Unable to load portal."}</p>
      </GlassCard>
    );
  }

  const approved = data.ideas.filter((i) => i.status === "APPROVED" || i.status === "IN_DEVELOPMENT").length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Innovator workspace</h1>
      <p className="text-muted-foreground mb-8">
        Welcome, {data.user.firstName}. Submit ideas, track progress, pay invoices, and rate our work — all private to your account.
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        <Button href="/portal/innovation/tracking" size="sm" variant="outline">Track submissions</Button>
        <Button href="/portal/innovation/invoices" size="sm" variant="outline">Invoices</Button>
        <Button href="/portal/innovation/payments" size="sm" variant="outline">Payment history</Button>
        <Button href="/portal/innovation/ratings" size="sm" variant="outline">Rate us</Button>
        <Button href="/portal/innovation/support" size="sm" variant="outline">Support</Button>
      </div>

      <div className="mb-8">
        <InnovatorIdeaForm />
      </div>

      <ClientWorkflowsPanel portalBase="/portal/innovation" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Lightbulb, label: "Ideas Submitted", value: String(data.stats.totalIdeas) },
          { icon: FolderKanban, label: "Approved / In Dev", value: String(approved) },
          { icon: Lightbulb, label: "Pending review", value: String(data.stats.blogsPending) },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <stat.icon className="h-6 w-6 text-gold mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Your Ideas</h2>
            <Button href="/portal/innovation/submit" size="sm">Submit New</Button>
          </div>
          {data.ideas.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ideas submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {data.ideas.map((idea) => (
                <div key={idea.id} className="rounded-xl bg-white/5 p-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{idea.title}</span>
                    <span className={`text-xs ${statusBadge(idea.status)}`}>
                      {idea.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{idea.category} · {formatPortalDate(idea.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

export function InnovatorSectionView({ section }: { section: string }) {
  const { data, loading } = usePortalData();
  if (loading || !data) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  if (section === "submit") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-2">Submit an Idea</h1>
        <p className="text-muted-foreground mb-6">Share your innovation with our team for review.</p>
        <InnovatorIdeaForm />
      </div>
    );
  }

  if (section === "ai") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-2">AI Idea Coach</h1>
        <p className="text-muted-foreground mb-6">
          Write your idea, then tap Get AI help — pay KES 100 by M-Pesa when prompted.
        </p>
        <IdeaAiCoach />
      </div>
    );
  }

  if (section === "testimonials") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-2">Share testimonial</h1>
        <p className="text-muted-foreground mb-6">
          This is not the company blog. Approved testimonials appear on the public homepage.
        </p>
        <PortalTestimonialForm />
      </div>
    );
  }

  if (section === "tracking") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-2">Track Progress</h1>
        <p className="text-muted-foreground mb-4">
          Idea review pipeline below. <strong>Finance, invoice, and payment</strong> appear when Finance sends a proposal — see{" "}
          <Button href="/portal/innovation/invoices" variant="ghost" size="sm" className="inline p-0 h-auto">Invoices</Button>.
          Progress on delivery starts only after you agree, pay the deposit, and receive your signed receipt. Until then, review status is shown below with no delivery %.
        </p>
        <ClientWorkflowsPanel portalBase="/portal/innovation" />
        <QuickRevisionPanel
          items={data.ideas
            .filter((i) => i.status !== "REJECTED")
            .map((idea) => ({
              id: idea.id,
              type: "idea" as const,
              title: idea.title,
              subtitle: idea.status.replace(/_/g, " ").toLowerCase(),
            }))}
          emptyMessage="Submit an idea first — then tap it here to ask for changes."
        />
        <div className="space-y-4">
          {data.ideas.length === 0 ? (
            <GlassCard><p className="text-muted-foreground">No submissions to track. <Button href="/portal/innovation/submit" size="sm">Submit an idea</Button></p></GlassCard>
          ) : data.ideas.map((idea) => {
            const linkedWorkflow = data.workflows?.find(
              (w) => w.type === "idea" && w.sourceId === idea.id
            );
            const { steps, percent } = ideaStatusToSteps(idea.status, idea.createdAt);
            const deliveryStages = linkedWorkflow
              ? parseWorkflowStages(linkedWorkflow.financeStages)
              : [];
            const showDelivery =
              linkedWorkflow && shouldShowWorkflowProgress(linkedWorkflow) && deliveryStages.length > 0;

            return (
              <GlassCard key={idea.id}>
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold">{idea.title}</h3>
                  <span className={`text-sm ${statusBadge(idea.status)}`}>{idea.status.replace(/_/g, " ")}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{idea.category} · Submitted {formatPortalDate(idea.createdAt)}</p>
                {idea.status === "REJECTED" ? (
                  <p className="text-sm text-red-400 mb-3">Not approved at this time. Check your email for details.</p>
                ) : null}
                {idea.status !== "REJECTED" && idea.status === "APPROVED" && !linkedWorkflow?.depositPaid && (
                  <p className="text-xs text-amber-400/90 mb-3">
                    Accepted — your department is reviewing scope and budget. Please wait for Finance to send your invoice
                    and project document.
                  </p>
                )}
                {linkedWorkflow?.status === "ASSIGNED_TO_DEPT" && !linkedWorkflow.depositPaid && (
                  <p className="text-xs text-life-green/90 mb-3">
                    With your department for review and budget. Invoice and signed project document will follow from Finance.
                  </p>
                )}
                <ScheduleProgressBar
                  steps={steps}
                  percent={percent}
                  showBar={false}
                  label="Review status"
                />
                {!showDelivery && idea.status !== "REJECTED" && (
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    Delivery progress (% by stage) begins after you pay the deposit and receive your signed receipt.
                  </p>
                )}
                {showDelivery && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <ScheduleProgressBar
                      steps={workflowStagesToScheduleSteps(deliveryStages)}
                      percent={progressFromStages(deliveryStages)}
                      label="Delivery progress (by stage)"
                    />
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <GlassCard>
      <p className="text-muted-foreground">This section will be populated as your innovation partnership grows.</p>
    </GlassCard>
  );
}
