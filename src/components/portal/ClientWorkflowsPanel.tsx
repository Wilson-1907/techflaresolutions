"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Loader2, AlertCircle } from "lucide-react";
import { ScheduleProgressBar } from "./ScheduleProgressBar";
import { PaymentDetailsSection } from "./PaymentDetailsSection";
import { InvoiceDepositBreakdown } from "./InvoiceDepositBreakdown";
import { MpesaPaymentForm } from "@/components/payments/MpesaPaymentForm";
import { InvoiceDepositPayPanel } from "@/components/portal/InvoiceDepositPayPanel";
import { WorkflowProposalActions } from "./WorkflowProposalActions";
import {
  parseWorkflowStages,
  progressFromStages,
  workflowStagesToScheduleSteps,
  shouldShowWorkflowProgress,
} from "@/lib/workflow-stages";

type Workflow = {
  id: string;
  title: string;
  status: string;
  financeTotal?: number | null;
  financeDocId?: string | null;
  financeStages?: Array<{
    title: string;
    description?: string;
    cost?: number;
    dueDate?: string | null;
    completed?: boolean;
  }>;
  depositPercent?: number;
  progress?: number;
  clientAgreed?: boolean;
  clientDeclined?: boolean;
  depositPaid?: boolean;
  workStarted?: boolean;
  workStartedAt?: string | null;
  department?: { name: string } | null;
};

export function ClientWorkflowsPanel({ portalBase = "/portal/client" }: { portalBase?: string }) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMpesaFor, setShowMpesaFor] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me/workflows", { credentials: "include" })
      .then((r) => r.json().catch(() => ({ workflows: [] })))
      .then((d) => setWorkflows(d.workflows || []))
      .finally(() => setLoading(false));
  }, []);

  function markAgreed(workflowId: string) {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === workflowId ? { ...w, status: "CLIENT_AGREED", clientAgreed: true } : w))
    );
    setShowMpesaFor(workflowId);
  }

  function markDeclined(workflowId: string) {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === workflowId ? { ...w, status: "REJECTED", clientDeclined: true } : w))
    );
  }

  if (loading) return null;
  if (workflows.length === 0) return null;

  const needsAttention = workflows.filter((w) => w.status === "SENT_TO_CLIENT" && !w.clientAgreed);

  return (
    <>
      {needsAttention.length > 0 && (
        <GlassCard className="mb-6 border-amber-500/40 bg-amber-500/5">
          <div className="flex gap-3">
            <AlertCircle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-200">You have {needsAttention.length} proposal(s) to review</p>
              <p className="text-sm text-muted-foreground mt-1">
                Finance has sent an invoice and project stages. Please agree, decline, or contact customer care before
                work can begin.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard className="mb-8 border-gold/20">
        <h2 className="text-lg font-bold mb-4">Your proposals & project progress</h2>
        <div className="space-y-4">
          {workflows.map((w) => {
            const stages = parseWorkflowStages(w.financeStages);
            const depositPct = w.depositPercent ?? 60;
            const depositAmount =
              w.financeTotal != null ? Math.round(w.financeTotal * (depositPct / 100)) : null;
            const depositLabel = depositAmount != null ? `KES ${depositAmount.toLocaleString()}` : null;
            const showProgress = shouldShowWorkflowProgress(w);
            const stageSteps = workflowStagesToScheduleSteps(stages);
            const stagePercent = showProgress && stages.length > 0 ? progressFromStages(stages) : 0;

            return (
              <div key={w.id} className="rounded-xl bg-white/5 p-4">
                <div className="flex flex-wrap justify-between gap-2 mb-2">
                  <p className="font-semibold">{w.title}</p>
                  <span className="text-xs text-muted-foreground capitalize">
                    {w.status.replace(/_/g, " ").toLowerCase()}
                    {w.department && ` · ${w.department.name}`}
                  </span>
                </div>

                {w.status === "SENT_TO_CLIENT" && !w.clientAgreed && (
                  <WorkflowProposalActions
                    workflowId={w.id}
                    title={w.title}
                    financeDocId={w.financeDocId}
                    depositAmount={depositAmount}
                    depositPercent={depositPct}
                    onAgreed={() => markAgreed(w.id)}
                    onDeclined={() => markDeclined(w.id)}
                  />
                )}

                {showMpesaFor === w.id && w.status === "CLIENT_AGREED" && !w.depositPaid && depositAmount != null && w.financeDocId && (
                  <div className="mb-4 rounded-xl border border-gold/25 bg-deep-blue/30 p-4 text-sm">
                    <p className="font-medium text-foreground mb-1">Pay deposit — M-Pesa prompt</p>
                    <p className="text-muted-foreground mb-3">
                      Deposit due: <strong className="text-gold">{depositLabel}</strong>. Enter your Safaricom number.
                    </p>
                    <InvoiceDepositPayPanel
                      compact
                      invoiceId={w.financeDocId}
                      invoiceNumber={w.title}
                      amount={depositAmount}
                      description={`Deposit for ${w.title}`}
                      onPaid={() => setShowMpesaFor(null)}
                    />
                  </div>
                )}

                {stages.length > 0 && (
                  <ul className="text-sm space-y-1 mb-3">
                    {stages.map((s, i) => (
                      <li key={i} className="text-muted-foreground">
                        {i + 1}. {s.title}
                        {s.cost != null && ` — KES ${s.cost.toLocaleString()}`}
                        {s.dueDate && ` · due ${new Date(s.dueDate).toLocaleDateString("en-KE")}`}
                        {showProgress && s.completed && " ✓"}
                      </li>
                    ))}
                  </ul>
                )}

                {w.financeTotal != null && (
                  <div className="mb-3">
                    <InvoiceDepositBreakdown
                      total={w.financeTotal}
                      depositPercent={depositPct}
                      depositPaid={!!w.depositPaid}
                      compact
                    />
                  </div>
                )}

                {(w.status === "CLIENT_AGREED" || (w.status === "SENT_TO_CLIENT" && w.clientAgreed)) && !w.depositPaid && (
                  <div className="mb-4">
                    <PaymentDetailsSection compact />
                  </div>
                )}

                {showProgress && stageSteps.length > 0 && (
                  <ScheduleProgressBar
                    steps={stageSteps}
                    percent={stagePercent}
                    label="Delivery progress (by stage)"
                  />
                )}

                {!showProgress && w.depositPaid && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Deposit receipt issued — delivery progress updates as each agreed stage is completed.
                  </p>
                )}

                {!showProgress && !w.depositPaid && w.status !== "REJECTED" && w.status !== "SENT_TO_CLIENT" && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    Delivery progress starts after you agree, pay your deposit, and receive your signed receipt.
                  </p>
                )}

                {w.status === "CLIENT_AGREED" && !w.depositPaid && depositAmount != null && showMpesaFor !== w.id && (
                  <div className="mt-4 rounded-xl border border-gold/20 bg-deep-blue/40 p-4 text-sm">
                    <p className="font-medium text-foreground mb-1">Pay deposit — M-Pesa prompt</p>
                    <p className="text-muted-foreground mb-3">
                      Deposit due: <strong className="text-gold">{depositLabel}</strong>. Enter your Safaricom number —
                      you will receive an M-Pesa prompt on your phone to enter your PIN.
                    </p>
                    {w.financeDocId && (showMpesaFor === w.id || w.clientAgreed) && (
                      <MpesaPaymentForm
                        compact
                        amount={depositAmount}
                        referenceType="invoice"
                        referenceId={w.financeDocId}
                        description={`Deposit for ${w.title}`}
                      />
                    )}
                    <p className="text-xs mt-3 text-muted-foreground">
                      Signed: Kinyanjui Wilson, Treasury Department · TechFlare Solutions
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button href={`${portalBase}/invoices`} size="sm" variant="outline">
                        View invoices
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>
    </>
  );
}
