"use client";

import Link from "next/link";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Loader2, Bell, Briefcase, FolderKanban, ArrowLeft, FileText, Receipt, History } from "lucide-react";
import { ScheduleProgressBar } from "./ScheduleProgressBar";
import { StaffMessagingPanel } from "./StaffMessagingPanel";
import {
  getActiveStages,
  sumStageCosts,
  stageLineTotal,
  progressFromStagesAndTimeline,
  workflowStagesToScheduleSteps,
  shouldShowWorkflowProgress,
  type WorkflowStage,
} from "@/lib/workflow-stages";
import {
  useEmployeePortalData,
  useEmployeeProject,
  employeeWorkflowAction,
  formatWorkflowStatus,
  invoiceStatusLabel,
  type EmployeeWorkflow,
} from "./useEmployeePortalData";
import { ScopeAiAssistant } from "@/components/scope/ScopeAiAssistant";
import { CatalogStagePicker } from "@/components/scope/CatalogStagePicker";
import { scopeLinesToStageRows, stageRowsToWorkflowStages } from "@/lib/scope-stage-utils";

type StageFormRow = {
  title: string;
  cost: string;
  quantity: string;
  dueDate: string;
  description: string;
  timeline: string;
};

const emptyStageRow = (): StageFormRow => ({
  title: "",
  cost: "",
  quantity: "1",
  dueDate: "",
  description: "",
  timeline: "",
});

function stagesFromForm(rows: StageFormRow[]) {
  return stageRowsToWorkflowStages(rows);
}

function ProjectLinkCard({ workflow }: { workflow: EmployeeWorkflow }) {
  const stages = getActiveStages(workflow);
  return (
    <Link
      href={`/portal/employee/projects/${workflow.id}`}
      className="block rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{workflow.title}</p>
          {workflow.projectNumber && (
            <p className="text-xs text-gold mt-0.5">{workflow.projectNumber}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1 capitalize">
            {formatWorkflowStatus(workflow.status)}
            {workflow.client && ` · ${workflow.client.firstName} ${workflow.client.lastName}`}
          </p>
        </div>
        {workflow.financeTotal != null && workflow.financeTotal > 0 && (
          <span className="text-sm font-medium text-gold">
            KES {workflow.financeTotal.toLocaleString()}
          </span>
        )}
      </div>
      {workflow.invoice && (
        <p className="text-xs text-muted-foreground mt-2">
          Invoice {workflow.invoice.number} · {invoiceStatusLabel(workflow.invoice.status)}
        </p>
      )}
      {stages.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">{stages.length} stage(s)</p>
      )}
    </Link>
  );
}

function ExecutiveReviewPanel({
  items,
  departments,
  onDone,
}: {
  items: EmployeeWorkflow[];
  departments: Array<{ id: string; name: string }>;
  onDone: () => void;
}) {
  const [deptPick, setDeptPick] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  if (items.length === 0) return null;

  async function act(workflowId: string, body: Record<string, unknown>) {
    setBusy(workflowId);
    try {
      await employeeWorkflowAction(workflowId, body);
      onDone();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <GlassCard className="mb-8 border-amber-500/30 bg-amber-500/5">
      <h2 className="text-lg font-bold text-amber-200 mb-2">CIO/CTO — executive review</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Admin sent these for consultation. Approve with a department (HOD will prepare budget & documentation) or reject.
      </p>
      <div className="space-y-4">
        {items.map((w) => (
          <div key={w.id} className="rounded-xl bg-black/30 p-4">
            <p className="font-semibold">{w.title}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{formatWorkflowStatus(w.status)}</p>
            {w.summary && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{w.summary}</p>}
            <div className="flex flex-wrap gap-2 mt-3 items-center">
              <select
                value={deptPick[w.id] || ""}
                onChange={(e) => setDeptPick({ ...deptPick, [w.id]: e.target.value })}
                className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs"
              >
                <option value="">Assign department…</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                disabled={busy === w.id || !deptPick[w.id]}
                onClick={() => act(w.id, { action: "executive_approve", departmentId: deptPick[w.id] })}
              >
                Approve → HOD queue
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy === w.id}
                onClick={() => act(w.id, { action: "executive_reject" })}
              >
                Reject
              </Button>
              <Link href={`/portal/employee/projects/${w.id}`} className="text-xs text-gold hover:underline">
                View details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function HodBudgetQueuePanel({ items }: { items: EmployeeWorkflow[] }) {
  if (items.length === 0) return null;

  return (
    <GlassCard className="mb-8 border-gold/40 bg-gold/5">
      <h2 className="text-lg font-bold text-gold mb-2">Action required — create invoice &amp; stages</h2>
      <p className="text-sm text-muted-foreground mb-4">
        These projects need your first invoice draft (amount, quantity, timeline) before Finance can review and send to
        the client.
      </p>
      <div className="space-y-3">
        {items.map((w) => (
          <Link
            key={w.id}
            href={`/portal/employee/projects/${w.id}`}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-black/30 p-4 hover:bg-black/40 transition-colors"
          >
            <div>
              <p className="font-semibold">{w.title}</p>
              {w.projectNumber && <p className="text-xs text-gold mt-0.5">{w.projectNumber}</p>}
              {w.client && (
                <p className="text-xs text-muted-foreground mt-1">
                  Client: {w.client.firstName} {w.client.lastName}
                </p>
              )}
            </div>
            <span className="text-xs font-medium text-gold">Create invoice →</span>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

export function EmployeeOverviewView() {
  const { data, loading, error, refresh } = useEmployeePortalData();

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error || "Unable to load employee portal."} />;

  const isHod = data.user.role === "HOD" || Boolean(data.profile?.isHod);
  const activeCount = data.activeWorkflows?.length ?? 0;
  const completedCount = data.completedWorkflows?.length ?? 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Employee workspace</h1>
      <p className="text-muted-foreground mb-8">
        Welcome, {data.user.firstName}. {data.profile?.position}
        {data.profile?.department && ` · ${data.profile.department.name}`}
        {data.profile?.workId && ` · ${data.profile.workId}`}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GlassCard>
          <Briefcase className="h-6 w-6 text-gold mb-2" />
          <div className="text-2xl font-bold">{data.departmentWorkflows.length}</div>
          <div className="text-sm text-muted-foreground">Department projects</div>
        </GlassCard>
        <GlassCard>
          <FolderKanban className="h-6 w-6 text-gold mb-2" />
          <div className="text-2xl font-bold">{activeCount}</div>
          <div className="text-sm text-muted-foreground">In delivery</div>
        </GlassCard>
        <GlassCard>
          <FileText className="h-6 w-6 text-gold mb-2" />
          <div className="text-2xl font-bold">{completedCount}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </GlassCard>
        <GlassCard>
          <Bell className="h-6 w-6 text-gold mb-2" />
          <div className="text-2xl font-bold">{data.notifications.length}</div>
          <div className="text-sm text-muted-foreground">Notifications</div>
        </GlassCard>
      </div>

      {(data.user.role === "CIO" || data.user.role === "ADMIN") && (
        <ExecutiveReviewPanel
          items={data.executiveReviewQueue ?? []}
          departments={data.departments ?? []}
          onDone={() => refresh()}
        />
      )}

      {isHod && (data.budgetQueue?.length ?? 0) > 0 && (
        <HodBudgetQueuePanel items={data.budgetQueue ?? []} />
      )}

      <div className="mb-8 flex flex-wrap gap-2">
        <Button href="/portal/employee/projects" size="sm" variant="outline">
          All projects
        </Button>
        <Button href="/portal/employee/invoices" size="sm" variant="outline">
          Invoices
        </Button>
        <Button href="/portal/employee/payments" size="sm" variant="outline">
          Payment history
        </Button>
        {isHod && (
          <Button href="/portal/employee/active" size="sm" variant="outline">
            Active delivery
          </Button>
        )}
        <Button href="/portal/employee/messages" size="sm" variant="outline">
          Company messages
        </Button>
      </div>

      {data.departmentWorkflows.length > 0 && (
        <GlassCard>
          <h2 className="text-lg font-bold mb-4">Recent projects</h2>
          <div className="space-y-3">
            {data.departmentWorkflows.slice(0, 5).map((w) => (
              <ProjectLinkCard key={w.id} workflow={w} />
            ))}
          </div>
          {data.departmentWorkflows.length > 5 && (
            <Button href="/portal/employee/projects" variant="outline" size="sm" className="mt-4">
              View all projects
            </Button>
          )}
        </GlassCard>
      )}
    </div>
  );
}

export function EmployeeProjectsView() {
  const { data, loading, error } = useEmployeePortalData();
  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error || "Unable to load projects."} />;

  const isHod = data.user.role === "HOD" || Boolean(data.profile?.isHod);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Department projects</h1>
      <p className="text-muted-foreground mb-8">
        {isHod
          ? "Each project has an automatic project number. Open a project to view the scope document and invoice status."
          : "Projects assigned to your department. Open any project for full details."}
      </p>
      {data.departmentWorkflows.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-muted-foreground">No workflows assigned to your department yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {data.departmentWorkflows.map((w) => (
            <ProjectLinkCard key={w.id} workflow={w} />
          ))}
        </div>
      )}
    </div>
  );
}

export function EmployeeActiveView() {
  const { data, loading, error } = useEmployeePortalData();
  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error || "Unable to load active projects."} />;

  const items = data.activeWorkflows ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Active delivery</h1>
      <p className="text-muted-foreground mb-8">
        Projects where the client deposit is paid and work is underway.
      </p>
      {items.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-muted-foreground">No projects currently in delivery.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map((w) => (
            <ProjectLinkCard key={w.id} workflow={w} />
          ))}
        </div>
      )}
    </div>
  );
}

export function EmployeeCompletedView() {
  const { data, loading, error } = useEmployeePortalData();
  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error || "Unable to load completed projects."} />;

  const items = data.completedWorkflows ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Completed projects</h1>
      <p className="text-muted-foreground mb-8">Finished department work.</p>
      {items.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-muted-foreground">No completed projects yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map((w) => (
            <ProjectLinkCard key={w.id} workflow={w} />
          ))}
        </div>
      )}
    </div>
  );
}

export function EmployeeNotificationsView() {
  const { data, loading, error } = useEmployeePortalData();
  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error || "Unable to load notifications."} />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Notifications</h1>
      <p className="text-muted-foreground mb-8">Updates for you and your department.</p>
      {data.notifications.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="space-y-3 text-sm">
            {data.notifications.map((n) => (
              <div key={n.id} className="rounded-xl bg-white/5 p-3">
                <p className="font-medium">{n.title}</p>
                <p className="text-muted-foreground mt-1">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(n.createdAt).toLocaleString("en-KE")}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export function EmployeeMessagesView() {
  const { data, loading, error } = useEmployeePortalData();
  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error || "Unable to load messages."} />;

  const isHod = data.user.role === "HOD" || Boolean(data.profile?.isHod);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Company messages</h1>
      <p className="text-muted-foreground mb-8">
        Message colleagues in any office, department, or direct to a person across the company.
      </p>
      <StaffMessagingPanel userRole={data.user.role} isHod={isHod} />
    </div>
  );
}

export function EmployeeInvoicesView() {
  const { data, loading, error } = useEmployeePortalData();
  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error || "Unable to load invoices."} />;

  const invoices = data.invoices ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Department invoices</h1>
      <p className="text-muted-foreground mb-8">
        Invoices Finance prepared from HOD scope documents for your department. This is <strong>not</strong> your personal
        payment history — clients pay from their portal. HOD/staff use this to track what was sent to Finance.
      </p>
      {invoices.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-muted-foreground">
            No invoices yet. Invoices are created after the HOD submits the scope document and Finance
            prepares the proposal.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <GlassCard key={inv.id}>
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-bold">{inv.number}</p>
                  <p className="text-sm text-muted-foreground">{inv.projectTitle}</p>
                  {inv.projectNumber && (
                    <p className="text-xs text-gold mt-0.5">{inv.projectNumber}</p>
                  )}
                  {inv.clientName && (
                    <p className="text-xs text-muted-foreground mt-1">Client: {inv.clientName}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold">KES {inv.total.toLocaleString()}</p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {invoiceStatusLabel(inv.status)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(inv.docDate).toLocaleDateString("en-KE")}
                  </p>
                </div>
              </div>
              <Button
                href={`/portal/employee/projects/${inv.workflowId}`}
                size="sm"
                variant="outline"
                className="mt-3"
              >
                View project
              </Button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

export function EmployeePaymentsView() {
  const { data, loading, error } = useEmployeePortalData();
  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error || "Unable to load payment history."} />;

  const receipts = data.receipts ?? [];
  const deposits = data.depositEvents ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Client deposit status</h1>
      <p className="text-muted-foreground mb-8">
        When clients pay the 60% deposit, receipts and status show here for your department projects. For full treasury
        reports use the{" "}
        <a href="https://techflaresolutionsfinance.vercel.app" className="text-gold underline" target="_blank" rel="noreferrer">
          Finance panel
        </a>
        .
      </p>

      {receipts.length > 0 && (
        <div className="space-y-3 mb-8">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-gold" />
            Signed receipts
          </h2>
          {receipts.map((r) => (
            <GlassCard key={r.id} className="border-life-green/30">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-bold">{r.number}</p>
                  <p className="text-sm text-muted-foreground">{r.projectTitle}</p>
                  {r.projectNumber && (
                    <p className="text-xs text-gold mt-0.5">{r.projectNumber}</p>
                  )}
                  {r.invoiceRef && (
                    <p className="text-xs text-muted-foreground mt-1">Invoice: {r.invoiceRef}</p>
                  )}
                  {r.paymentMethod && (
                    <p className="text-xs text-muted-foreground mt-1">{r.paymentMethod}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold">KES {r.total.toLocaleString()}</p>
                  {r.paidAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.paidAt).toLocaleDateString("en-KE")}
                    </p>
                  )}
                </div>
              </div>
              <Button
                href={`/portal/employee/projects/${r.workflowId}`}
                size="sm"
                variant="outline"
                className="mt-3"
              >
                View project
              </Button>
            </GlassCard>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <History className="h-5 w-5 text-gold" />
          Deposit status
        </h2>
        {deposits.length === 0 ? (
          <GlassCard>
            <p className="text-sm text-muted-foreground">No client deposits recorded yet for your department.</p>
          </GlassCard>
        ) : (
          deposits.map((d) => (
            <GlassCard key={d.workflowId}>
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-medium">{d.projectTitle}</p>
                  {d.projectNumber && (
                    <p className="text-xs text-gold">{d.projectNumber}</p>
                  )}
                  {d.clientName && (
                    <p className="text-xs text-muted-foreground">Client: {d.clientName}</p>
                  )}
                </div>
                <div className="text-right text-sm">
                  <p className="text-life-green font-medium">Deposit paid</p>
                  {d.amount != null && (
                    <p className="text-gold font-bold">KES {d.amount.toLocaleString()}</p>
                  )}
                  {d.paidAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(d.paidAt).toLocaleDateString("en-KE")}
                    </p>
                  )}
                  {d.receiptNumber && (
                    <p className="text-xs text-muted-foreground">Receipt: {d.receiptNumber}</p>
                  )}
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}

export function EmployeeProjectDetailView({ projectId }: { projectId: string }) {
  const { project, profile, user, loading, error, refresh } = useEmployeeProject(projectId);
  const [busy, setBusy] = useState<string | null>(null);
  const [budgetEdit, setBudgetEdit] = useState<{ brief: string; stages: StageFormRow[] } | null>(null);

  async function workflowAction(body: Record<string, unknown>) {
    if (!project) return null;
    setBusy(project.id);
    try {
      const json = await employeeWorkflowAction(project.id, body);
      await refresh();
      return json;
    } catch (e) {
      alert(e instanceof Error ? e.message : "Action failed");
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function submitBudget() {
    if (!budgetEdit?.brief.trim()) {
      alert("Enter a brief for finance.");
      return;
    }
    const stages = stagesFromForm(budgetEdit.stages);
    if (stages.length === 0) {
      alert("Add at least one stage with a title and price.");
      return;
    }
    const total = sumStageCosts(stages);
    if (total <= 0) {
      alert("Enter a price for each stage — total is calculated automatically.");
      return;
    }
    const ok = await workflowAction({
      action: "hod_submit_budget",
      hodBrief: budgetEdit.brief.trim(),
      hodStages: stages,
    });
    if (ok) {
      setBudgetEdit(null);
      alert(`First invoice & stages sent to Finance. Total: KES ${total.toLocaleString()}`);
    }
  }

  if (loading) return <LoadingState />;
  if (error || !project || !user) {
    return <ErrorState message={error || "Project not found."} />;
  }

  const isHod = user.role === "HOD" || Boolean(profile?.isHod);
  const stages = getActiveStages(project);
  const displayStages = stages;
  const draftStages = budgetEdit ? stagesFromForm(budgetEdit.stages) : [];
  const draftTotal = sumStageCosts(draftStages);

  return (
    <div>
      <Button href="/portal/employee/projects" variant="outline" size="sm" className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        All projects
      </Button>

      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        {project.projectNumber && (
          <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-sm font-medium text-gold">
            {project.projectNumber}
          </span>
        )}
      </div>
      <p className="text-muted-foreground mb-8 capitalize">
        {formatWorkflowStatus(project.status)}
        {project.department && ` · ${project.department.name}`}
      </p>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <h2 className="text-lg font-bold mb-3">Project overview</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Client</dt>
              <dd className="font-medium">
                {project.client
                  ? `${project.client.firstName} ${project.client.lastName}`
                  : "—"}
                {project.client?.email && (
                  <span className="block text-xs text-muted-foreground font-normal">
                    {project.client.email}
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Original request</dt>
              <dd className="mt-1 whitespace-pre-wrap">{project.summary}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd>{new Date(project.createdAt).toLocaleDateString("en-KE")}</dd>
            </div>
          </dl>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-bold mb-3">Finance & invoice</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Project total</dt>
              <dd className="text-lg font-bold text-gold">
                {project.financeTotal != null && project.financeTotal > 0
                  ? `KES ${project.financeTotal.toLocaleString()}`
                  : "Pending HOD scope document"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Invoice</dt>
              <dd>
                {project.invoice ? (
                  <>
                    <span className="font-medium">{project.invoice.number}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {invoiceStatusLabel(project.invoice.status)}
                    </span>
                  </>
                ) : project.financeDocId ? (
                  "Invoice draft in finance"
                ) : (
                  "Invoice follows after finance prepares from HOD document"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Client agreement</dt>
              <dd>
                {project.clientDeclined
                  ? "Client declined"
                  : project.clientAgreed
                    ? `Agreed ${project.clientAgreedAt ? new Date(project.clientAgreedAt).toLocaleDateString("en-KE") : ""}`
                    : "Awaiting client response"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Deposit (60%)</dt>
              <dd>{project.depositPaid ? "Paid" : "Not paid yet"}</dd>
            </div>
          </dl>
        </GlassCard>
      </div>

      {(project.hodBrief || displayStages.length > 0) && (
        <GlassCard className="mb-8">
          <h2 className="text-lg font-bold mb-3">HOD scope document</h2>
          {project.hodBrief && (
            <p className="text-sm whitespace-pre-wrap mb-4 text-muted-foreground">{project.hodBrief}</p>
          )}
          {displayStages.length > 0 && (
            <div className="space-y-2">
              {displayStages.map((s, i) => (
                <div key={i} className="rounded-xl bg-white/5 p-3 text-sm">
                  <p className="font-medium">
                    {i + 1}. {s.title}
                    {s.quantity != null && s.quantity > 1 && (
                      <span className="text-muted-foreground ml-1">× {s.quantity}</span>
                    )}
                    {s.cost != null && s.cost > 0 && (
                      <span className="text-gold ml-2">KES {stageLineTotal(s).toLocaleString()}</span>
                    )}
                  </p>
                  {s.description && <p className="text-muted-foreground mt-1">{s.description}</p>}
                  {s.dueDate && (
                    <p className="text-xs text-gold/80 mt-1">
                      Due {new Date(s.dueDate).toLocaleDateString("en-KE")}
                    </p>
                  )}
                  {s.assignee && (
                    <p className="text-xs text-muted-foreground mt-1">Assigned: {s.assignee}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {shouldShowWorkflowProgress(project) && displayStages.length > 0 && (
        <GlassCard className="mb-8">
          <h2 className="text-lg font-bold mb-3">Progress</h2>
          <ScheduleProgressBar
            steps={workflowStagesToScheduleSteps(displayStages)}
            percent={progressFromStagesAndTimeline(displayStages, project.workStartedAt)}
            label="Stage progress"
          />
        </GlassCard>
      )}

      {isHod && project.status === "ASSIGNED_TO_DEPT" && (
        <GlassCard className="mb-8">
          <h2 className="text-lg font-bold mb-2">Create first invoice &amp; stages</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Describe the project — AI drafts stages with quantity, price, and timeline from our shared catalog.
            Edit every row manually before sending to Finance.
          </p>
          {!budgetEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBudgetEdit({ brief: "", stages: [emptyStageRow()] })}
            >
              Create invoice draft
            </Button>
          )}
          {budgetEdit && (
            <div className="space-y-3">
              <ScopeAiAssistant
                onApply={(brief, lines) => {
                  const { brief: b, stages } = scopeLinesToStageRows(brief, lines);
                  setBudgetEdit({ brief: b, stages });
                }}
              />
              <CatalogStagePicker
                onAdd={(row) =>
                  setBudgetEdit({
                    ...budgetEdit,
                    stages: [...budgetEdit.stages, row],
                  })
                }
              />
              <textarea
                className="w-full rounded-lg bg-white/5 p-2 text-sm"
                rows={3}
                placeholder="Scope brief for finance and client proposal"
                value={budgetEdit.brief}
                onChange={(e) => setBudgetEdit({ ...budgetEdit, brief: e.target.value })}
              />
              {budgetEdit.stages.map((s, i) => (
                <div key={i} className="space-y-2 rounded-lg border border-white/10 p-2">
                  <input
                    className="w-full rounded-lg bg-white/5 p-2 text-sm"
                    placeholder={`Stage ${i + 1} title`}
                    value={s.title}
                    onChange={(e) => {
                      const stages = [...budgetEdit.stages];
                      stages[i] = { ...stages[i], title: e.target.value };
                      setBudgetEdit({ ...budgetEdit, stages });
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="number"
                      min={1}
                      className="w-20 rounded-lg bg-white/5 p-2 text-sm"
                      placeholder="Qty"
                      value={s.quantity}
                      onChange={(e) => {
                        const stages = [...budgetEdit.stages];
                        stages[i] = { ...stages[i], quantity: e.target.value };
                        setBudgetEdit({ ...budgetEdit, stages });
                      }}
                    />
                    <input
                      type="number"
                      className="w-32 rounded-lg bg-white/5 p-2 text-sm"
                      placeholder="Unit price (KES)"
                      value={s.cost}
                      onChange={(e) => {
                        const stages = [...budgetEdit.stages];
                        stages[i] = { ...stages[i], cost: e.target.value };
                        setBudgetEdit({ ...budgetEdit, stages });
                      }}
                    />
                    <input
                      type="text"
                      className="flex-1 min-w-[120px] rounded-lg bg-white/5 p-2 text-sm"
                      placeholder="Timeline (e.g. 3–5 days)"
                      value={s.timeline}
                      onChange={(e) => {
                        const stages = [...budgetEdit.stages];
                        stages[i] = { ...stages[i], timeline: e.target.value };
                        setBudgetEdit({ ...budgetEdit, stages });
                      }}
                    />
                    <input
                      type="date"
                      className="flex-1 min-w-[140px] rounded-lg bg-white/5 p-2 text-sm"
                      value={s.dueDate}
                      onChange={(e) => {
                        const stages = [...budgetEdit.stages];
                        stages[i] = { ...stages[i], dueDate: e.target.value };
                        setBudgetEdit({ ...budgetEdit, stages });
                      }}
                    />
                  </div>
                  <input
                    className="w-full rounded-lg bg-white/5 p-2 text-sm"
                    placeholder="Stage notes (optional)"
                    value={s.description}
                    onChange={(e) => {
                      const stages = [...budgetEdit.stages];
                      stages[i] = { ...stages[i], description: e.target.value };
                      setBudgetEdit({ ...budgetEdit, stages });
                    }}
                  />
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setBudgetEdit({
                      ...budgetEdit,
                      stages: [...budgetEdit.stages, emptyStageRow()],
                    })
                  }
                >
                  + Stage
                </Button>
                <p className="text-sm font-semibold text-gold ml-auto">
                  Total: KES {draftTotal.toLocaleString()}
                </p>
              </div>
              <Button size="sm" disabled={busy === project.id} onClick={submitBudget}>
                {busy === project.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send invoice draft to Finance"
                )}
              </Button>
            </div>
          )}
        </GlassCard>
      )}

      {isHod && project.status === "DEPOSIT_PAID" && displayStages.length > 0 && (
        <GlassCard className="mb-8">
          <p className="text-sm text-muted-foreground mb-3">
            Client deposit is paid. Begin work to start the delivery timeline and show progress to the client.
          </p>
          <Button
            size="sm"
            disabled={busy === project.id}
            onClick={() => workflowAction({ action: "hod_begin_work" })}
          >
            {busy === project.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Begin work & notify client"
            )}
          </Button>
        </GlassCard>
      )}

      {["WORK_STARTED", "IN_PROGRESS", "COMPLETED"].includes(project.status) &&
        displayStages.length > 0 && (
          <GlassCard>
            <h2 className="text-lg font-bold mb-3">Delivery stages</h2>
            <div className="space-y-2">
              {displayStages.map((stage, index) => (
                <StageRowControls
                  key={`${project.id}-${index}`}
                  stage={stage}
                  index={index}
                  isHod={isHod}
                  busy={busy === project.id}
                  onToggle={(completed) =>
                    workflowAction({ action: "toggle_stage", stageIndex: index, completed })
                  }
                  onAssign={(assignee) =>
                    workflowAction({ action: "assign_stage_work", stageIndex: index, assignee })
                  }
                />
              ))}
            </div>
          </GlassCard>
        )}
    </div>
  );
}

function StageRowControls({
  stage,
  isHod,
  busy,
  onToggle,
  onAssign,
}: {
  stage: WorkflowStage;
  index: number;
  isHod: boolean;
  busy: boolean;
  onToggle: (completed: boolean) => void;
  onAssign: (assignee: string) => void;
}) {
  const [assignee, setAssignee] = useState(stage.assignee ?? "");

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-black/20 p-2 text-sm">
      <label className="flex items-center gap-2 flex-1 min-w-[200px]">
        <input
          type="checkbox"
          checked={!!stage.completed}
          disabled={busy}
          onChange={(e) => onToggle(e.target.checked)}
          className="rounded"
        />
        <span className={stage.completed ? "line-through text-muted-foreground" : ""}>
          {stage.title}
          {stage.dueDate && (
            <span className="text-xs text-gold/80 ml-1">
              · due {new Date(stage.dueDate).toLocaleDateString("en-KE")}
            </span>
          )}
        </span>
      </label>
      {isHod && (
        <div className="flex gap-1 items-center">
          <input
            className="w-36 rounded-lg bg-white/5 px-2 py-1 text-xs"
            placeholder="Assign to"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => onAssign(assignee)}
          >
            Save
          </Button>
        </div>
      )}
      {!isHod && stage.assignee && (
        <span className="text-xs text-muted-foreground">Assigned: {stage.assignee}</span>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-gold" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <GlassCard className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
    </GlassCard>
  );
}

export function EmployeeSectionView({ section }: { section: string }) {
  switch (section) {
    case "projects":
      return <EmployeeProjectsView />;
    case "active":
      return <EmployeeActiveView />;
    case "completed":
      return <EmployeeCompletedView />;
    case "notifications":
      return <EmployeeNotificationsView />;
    case "messages":
      return <EmployeeMessagesView />;
    case "invoices":
      return <EmployeeInvoicesView />;
    case "payments":
      return <EmployeePaymentsView />;
    default:
      return null;
  }
}
