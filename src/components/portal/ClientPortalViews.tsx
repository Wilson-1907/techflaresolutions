"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/site";
import {
  FolderKanban, FileText, MessageSquare, Award, ShoppingBag,
  Star, Users, Loader2, Wrench, Receipt, History, HeadphonesIcon, Quote, Send, PenLine,
} from "lucide-react";
import { usePortalData, formatPortalDate, statusBadge, type PortalData } from "./usePortalData";
import { ScheduleProgressBar } from "./ScheduleProgressBar";
import { ClientWorkflowsPanel } from "./ClientWorkflowsPanel";
import { resolveProjectSchedule } from "@/lib/schedule-progress";
import { QuickRevisionPanel } from "./QuickRevisionPanel";
import { buildClientRevisionItems, buildClientRateableItems } from "./client-portal-items";
import { SupportTicketPanel } from "./SupportTicketPanel";
import { SupportTicketList } from "./SupportTicketList";
import { PaymentDetailsSection } from "./PaymentDetailsSection";
import { PortalTestimonialForm } from "./PortalTestimonialForm";
import { ClientRequestForm } from "./PortalSubmitForms";
import { InvoicePaySection } from "./InvoicePaySection";
import { InvoiceDepositBreakdown } from "./InvoiceDepositBreakdown";
import { WorkflowProposalActions } from "./WorkflowProposalActions";
import { InvoiceDepositPayPanel } from "@/components/portal/InvoiceDepositPayPanel";
import { formSelectClass } from "@/lib/form-styles";
import { apiUrl } from "@/lib/api-base";
import {
  parseWorkflowStages,
  progressFromStages,
  workflowStagesToScheduleSteps,
  shouldShowWorkflowProgress,
} from "@/lib/workflow-stages";

function ClientPortalNavHub() {
  const links = [
    { href: "/portal/client/projects", label: "Projects", icon: FolderKanban, desc: "All work & documents" },
    { href: "/portal/client/services", label: "Services ordered", icon: Wrench, desc: "Your requests" },
    { href: "/portal/client/orders", label: "Purchases", icon: ShoppingBag, desc: "Products bought" },
    { href: "/portal/client/documents", label: "Deliverables", icon: FileText, desc: "Files & scope docs" },
    { href: "/portal/client/revisions", label: "Revisions", icon: PenLine, desc: "Request changes" },
    { href: "/portal/client/invoices", label: "Invoices", icon: Receipt, desc: "Track & pay" },
    { href: "/portal/client/payments", label: "Payment history", icon: History, desc: "Receipts & M-Pesa" },
    { href: "/portal/client/support", label: "Support", icon: HeadphonesIcon, desc: "Get help" },
    { href: "/portal/client/ratings", label: "Rate us", icon: Star, desc: "Share experience" },
    { href: "/portal/client/testimonials", label: "Testimonials", icon: Quote, desc: "Share your story" },
    { href: "/portal/client/messages", label: "Notifications", icon: MessageSquare, desc: "Updates" },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
      {links.map((link) => (
        <Button
          key={link.href}
          href={link.href}
          variant="outline"
          className="h-auto flex-col items-start gap-1 py-4 px-4 text-left"
        >
          <span className="flex items-center gap-2 font-semibold">
            <link.icon className="h-4 w-4 text-gold shrink-0" />
            {link.label}
          </span>
          <span className="text-xs text-muted-foreground font-normal">{link.desc}</span>
        </Button>
      ))}
    </div>
  );
}

export function ClientDashboardView() {
  const { data, loading, error, refresh } = usePortalData();

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
        <p className="text-muted-foreground">{error || "Unable to load portal data."}</p>
      </GlassCard>
    );
  }

  const { user, stats } = data;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Client workspace</h1>
      <p className="text-muted-foreground mb-8">
        Welcome, {user.firstName}. Projects, invoices, revisions, support, and everything you&apos;ve ordered with us.
      </p>

      <ClientPortalNavHub />

      <div className="mb-8 flex flex-wrap gap-2">
        <Button href="/portal/client/projects" size="sm" variant="outline">Projects</Button>
        <Button href="/portal/client/revisions" size="sm" variant="outline">Revisions</Button>
        <Button href="/portal/client/invoices" size="sm" variant="outline">Invoices</Button>
        <Button href="/portal/client/payments" size="sm" variant="outline">Payment history</Button>
        <Button href="/portal/client/support" size="sm" variant="outline">Support</Button>
      </div>

      <ClientWorkflowsPanel />

      <div className="mb-8">
        <ClientRequestForm />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FolderKanban, label: "Active Projects", value: String(stats.activeProjects) },
          { icon: ShoppingBag, label: "Product Orders", value: String(stats.totalOrders) },
          { icon: FileText, label: "Pending Invoices", value: String(stats.pendingInvoices) },
          { icon: Award, label: "Reward Points", value: stats.points.toLocaleString() },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <stat.icon className="h-6 w-6 text-gold mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mb-8 border-gold/20">
        <h2 className="text-lg font-bold mb-2">TechFlare Solutions Points</h2>
        <p className="text-sm text-muted-foreground">{company.pointsDescription}</p>
        {!user.communityMember && (
          <div className="mt-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-life-green" />
            <p className="text-sm">
              Join our <Button href="/community" variant="ghost" size="sm" className="inline p-0 h-auto">WhatsApp community</Button> for careers and group activities.
            </p>
          </div>
        )}
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Projects</h2>
            <Button href="/portal/client/projects" variant="ghost" size="sm">View all</Button>
          </div>
          {data.projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet. <Button href="/solutions" variant="ghost" size="sm" className="inline p-0 h-auto">Request a solution</Button></p>
          ) : (
            <div className="space-y-3">
              {data.projects.slice(0, 4).map((project) => {
                const { steps, percent } = resolveProjectSchedule(project.milestones, project.status, project.progress);
                return (
                <div key={project.id} className="rounded-xl bg-white/5 p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{project.name}</span>
                    <span className={`text-xs ${statusBadge(project.status)}`}>
                      {project.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <ScheduleProgressBar steps={steps} percent={percent} showSteps={false} compact label="" />
                </div>
              );})}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Purchase History</h2>
            <Button href="/portal/client/orders" variant="ghost" size="sm">View all</Button>
          </div>
          {data.orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet. <Button href="/products" variant="ghost" size="sm" className="inline p-0 h-auto">Browse products</Button></p>
          ) : (
            <div className="space-y-3">
              {data.orders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex justify-between rounded-xl bg-white/5 p-4 text-sm">
                  <div>
                    <p className="font-medium">{order.productTitle}</p>
                    <p className="text-muted-foreground">{order.plan} · {formatPortalDate(order.createdAt)}</p>
                  </div>
                  <span className={`capitalize ${statusBadge(order.status)}`}>{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <RatingPanel data={data} ratings={data.ratings} onRated={refresh} />

      <GlassCard>
        <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
        {data.recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="space-y-3 text-sm">
            {data.recentActivity.slice(0, 8).map((activity, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-gold shrink-0" />
                {activity.text}
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function RatingPanel({
  data,
  ratings,
  onRated,
  showEmpty = false,
}: {
  data: PortalData;
  ratings: Array<{ targetType: string; targetRef: string; rating: number }>;
  onRated: () => void;
  showEmpty?: boolean;
}) {
  const [selected, setSelected] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const rateable = buildClientRateableItems(data);

  if (rateable.length === 0) {
    if (!showEmpty) return null;
    return (
      <GlassCard>
        <p className="text-sm text-muted-foreground">
          When you have completed work with us, you can rate products, services, or projects here.
        </p>
      </GlassCard>
    );
  }

  async function submitRating(e: React.FormEvent) {
    e.preventDefault();
    const item = rateable.find((r) => `${r.type}:${r.ref}` === selected);
    if (!item) return;
    setSaving(true);
    await fetch(apiUrl("/api/me/ratings"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        targetType: item.type,
        targetRef: item.ref,
        targetTitle: item.title,
        rating,
        comment,
      }),
    });
    setSaving(false);
    setComment("");
    onRated();
  }

  return (
    <GlassCard className="mb-8 border-life-green/20">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
        <Star className="h-5 w-5 text-gold" /> Rate Our Services
      </h2>
      <p className="text-sm text-muted-foreground mb-4">Your feedback helps us improve. Rate products, services, or projects you&apos;ve used.</p>
      {ratings.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {ratings.map((r) => (
            <span key={`${r.targetType}-${r.targetRef}`} className="rounded-full bg-gold/10 px-3 py-1 text-xs text-gold">
              {"★".repeat(r.rating)} rated
            </span>
          ))}
        </div>
      )}
      <form onSubmit={submitRating} className="flex flex-wrap gap-3 items-end">
        <select
          required
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={`${formSelectClass} min-w-[200px] text-sm py-2`}
        >
          <option value="">Select item to rate</option>
          {rateable.map((r) => (
            <option key={`${r.type}:${r.ref}`} value={`${r.type}:${r.ref}`}>
              [{r.type}] {r.title}
            </option>
          ))}
        </select>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className={`${formSelectClass} text-sm py-2`}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} stars</option>
          ))}
        </select>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment"
          className="flex-1 min-w-[180px] rounded-xl border border-gold/20 bg-black/30 px-3 py-2 text-sm"
        />
        <Button type="submit" size="sm" disabled={saving}>{saving ? "Saving..." : "Submit Rating"}</Button>
      </form>
    </GlassCard>
  );
}

function parseProjectTotalFromInvoice(inv: { amount: number; notes?: string | null }) {
  if (inv.notes) {
    const match = inv.notes.match(/Project total:\s*KES\s*([\d,]+)/i);
    if (match) return parseInt(match[1].replace(/,/g, ""), 10);
  }
  return Math.round(inv.amount / 0.6);
}

export function ClientSectionView({
  section,
  portalBase = "/portal/client",
}: {
  section: string;
  portalBase?: string;
}) {
  const { data, loading, refresh } = usePortalData();

  if (loading || !data) {
    return <div className="py-12 text-center text-muted-foreground">Loading...</div>;
  }

  const configs: Record<string, { title: string; description: string }> = {
    submit: { title: "New request", description: "Send a project request to TechFlare — stays in your workspace, not the public site." },
    projects: { title: "Projects", description: "All projects TechFlare is delivering for you — scope, progress, and linked documents." },
    orders: { title: "Purchases", description: "Every product you have ordered from TechFlare." },
    services: { title: "Services ordered", description: "Solution and service requests you submitted and their review status." },
    revisions: { title: "Revisions", description: "Request changes to active projects, services, or purchases. Your revision history is tracked here." },
    invoices: { title: "Invoices", description: "View and pay invoices with M-Pesa. Track financial status for your work." },
    payments: { title: "Payment history", description: "M-Pesa payments and signed receipts for invoices, orders, and services." },
    points: { title: "Loyalty points", description: "Your TechFlare reward points and how to earn more." },
    support: { title: "Support", description: "Ask for help with account, billing, login, or delivery — we respond through tickets." },
    documents: { title: "Deliverables & documents", description: "Project files, scope documents, and deliverables from your work with us." },
    messages: { title: "Notifications", description: "Updates about your account, proposals, payments, and revisions." },
    ratings: { title: "Rate our services", description: "Share your experience rating products, services, and projects." },
    testimonials: { title: "Share testimonial", description: "Approved stories appear on the public homepage — separate from the company blog." },
  };

  const config = configs[section];
  if (!config) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{config.title}</h1>
      <p className="text-muted-foreground mb-6">{config.description}</p>

      {section === "submit" && <ClientRequestForm />}

      {section === "projects" && (
        <div className="space-y-6">
          <QuickRevisionPanel
            items={buildClientRevisionItems(data)}
            emptyMessage="When a project or request is active, tap it here to ask for a change — or use the Revisions section."
          />

          {(data.workflows ?? []).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Service projects</h2>
              {(data.workflows ?? []).map((w) => {
                const stages = parseWorkflowStages(w.financeStages);
                const showProgress = shouldShowWorkflowProgress(w) && stages.length > 0;
                return (
                  <GlassCard key={w.id}>
                    <div className="flex flex-wrap justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold">{w.title}</h3>
                        {w.projectNumber && (
                          <p className="text-xs text-gold mt-0.5">{w.projectNumber}</p>
                        )}
                        {w.department && (
                          <p className="text-xs text-muted-foreground">{w.department.name}</p>
                        )}
                      </div>
                      <span className={`text-sm capitalize h-fit ${statusBadge(w.status ?? "")}`}>
                        {(w.status ?? "").replace(/_/g, " ").toLowerCase()}
                      </span>
                    </div>
                    {w.summary && (
                      <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">{w.summary}</p>
                    )}
                    {w.hodBrief && (
                      <div className="rounded-xl bg-white/5 p-3 mb-3 text-sm">
                        <p className="text-xs font-medium text-gold mb-1">Scope document</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{w.hodBrief}</p>
                      </div>
                    )}
                    {showProgress && (
                      <ScheduleProgressBar
                        steps={workflowStagesToScheduleSteps(stages)}
                        percent={progressFromStages(stages)}
                        label="Delivery progress"
                      />
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button href={`${portalBase}/invoices`} size="sm" variant="outline">Invoices</Button>
                      <Button href={`${portalBase}/revisions`} size="sm" variant="outline">Request revision</Button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-bold">All projects</h2>
          {data.projects.length === 0 && (data.workflows ?? []).length === 0 ? (
            <GlassCard><p className="text-muted-foreground">No projects yet.</p></GlassCard>
          ) : data.projects.length === 0 ? (
            <GlassCard><p className="text-muted-foreground">Legacy project records will appear here when assigned.</p></GlassCard>
          ) : data.projects.map((p) => {
            const { steps, percent } = resolveProjectSchedule(p.milestones, p.status, p.progress);
            return (
            <GlassCard key={p.id}>
              <div className="flex justify-between mb-3">
                <h3 className="font-bold">{p.name}</h3>
                <span className={`text-sm ${statusBadge(p.status)}`}>{p.status.replace(/_/g, " ")}</span>
              </div>
              {p.description && <p className="text-sm text-muted-foreground mb-4">{p.description}</p>}
              <ScheduleProgressBar steps={steps} percent={percent} label="Project schedule" />
            </GlassCard>
          );})}
          </div>
        </div>
      )}

      {section === "orders" && (
        <div className="space-y-3">
          {data.orders.length === 0 ? (
            <GlassCard><p className="text-muted-foreground">No orders yet. <Button href="/products">Browse products</Button></p></GlassCard>
          ) : data.orders.map((o) => (
            <GlassCard key={o.id} className="flex justify-between">
              <div>
                <p className="font-bold">{o.productTitle}</p>
                <p className="text-sm text-muted-foreground">{o.plan} · {formatPortalDate(o.createdAt)}</p>
              </div>
              <span className={`capitalize text-sm ${statusBadge(o.status)}`}>{o.status}</span>
            </GlassCard>
          ))}
        </div>
      )}

      {section === "services" && (
        <div className="space-y-6">
          <QuickRevisionPanel
            items={data.solutions.map((s) => ({
              id: s.id,
              type: "solution" as const,
              title: s.problem.slice(0, 80) + (s.problem.length > 80 ? "…" : ""),
              subtitle: s.status.replace(/_/g, " ").toLowerCase(),
            }))}
            emptyMessage="Submit a request first — then tap it here to ask for changes."
          />
        <div className="space-y-3">
          {data.solutions.length === 0 ? (
            <GlassCard>
              <p className="text-muted-foreground mb-4">No service requests yet.</p>
              <Button href="/portal/client/submit" size="sm">Submit a request</Button>
            </GlassCard>
          ) : data.solutions.map((s) => (
            <GlassCard key={s.id}>
              <div className="flex justify-between mb-2">
                <span className={`text-sm ${statusBadge(s.status)}`}>{s.status.replace(/_/g, " ")}</span>
                <span className="text-xs text-muted-foreground">{formatPortalDate(s.createdAt)}</span>
              </div>
              <p className="text-sm">{s.problem}</p>
              <p className="text-xs text-muted-foreground mt-1">Industry: {s.industry}</p>
            </GlassCard>
          ))}
        </div>
        </div>
      )}

      {section === "payments" && (
        <div className="space-y-3">
          <PaymentDetailsSection />
          <p className="text-sm text-muted-foreground mb-4">
            Signed receipts from Finance and M-Pesa payment confirmations appear here. Open an invoice statement
            from <Button href={`${portalBase}/invoices`} size="sm" variant="ghost" className="inline p-0 h-auto">Invoices</Button>{" "}
            to agree, pay your deposit, or contact customer care.
          </p>
          {data.invoices.filter((i) => i.status !== "paid").length > 0 && (
            <>
              <h2 className="text-lg font-bold">Outstanding invoices</h2>
              {data.invoices
                .filter((i) => i.status !== "paid")
                .map((inv) => {
                  const wf = inv.workflowId
                    ? (data.workflows ?? []).find((w) => w.id === inv.workflowId)
                    : (data.workflows ?? []).find((w) => w.financeDocId === inv.id);
                  return (
                    <GlassCard key={inv.id} className="border-amber-500/30">
                      <div className="flex flex-wrap justify-between gap-2 mb-2">
                        <div>
                          <p className="font-bold">{inv.number}</p>
                          <p className="text-sm text-muted-foreground">{inv.projectName}</p>
                        </div>
                        <p className="text-gold font-bold">
                          {inv.currency} {inv.amount.toLocaleString()}
                        </p>
                      </div>
                      {wf?.status === "SENT_TO_CLIENT" && !wf.clientAgreed && (
                        <p className="text-xs text-amber-300 mb-2">Awaiting your agreement on the proposal.</p>
                      )}
                      <Button href={`${portalBase}/invoices`} size="sm" variant="outline">
                        View invoice statement
                      </Button>
                    </GlassCard>
                  );
                })}
            </>
          )}
          {(data.receipts ?? []).length > 0 && (
            <>
              <h2 className="text-lg font-bold">Signed receipts</h2>
              {(data.receipts ?? []).map((r) => (
                <GlassCard key={r.id} className="border-life-green/30">
                  <div className="flex flex-wrap justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold">{r.number}</p>
                      {r.invoiceRef && (
                        <p className="text-sm text-muted-foreground">Invoice ref: {r.invoiceRef}</p>
                      )}
                    </div>
                    <p className="text-gold font-bold">
                      {r.currency} {r.amount.toLocaleString()}
                    </p>
                  </div>
                  {r.paymentMethod && (
                    <p className="text-sm text-muted-foreground">{r.paymentMethod}</p>
                  )}
                  {r.paidAt && (
                    <p className="text-xs text-muted-foreground mt-1">{formatPortalDate(r.paidAt)}</p>
                  )}
                  {r.signed && r.issuerName && (
                    <p className="text-xs text-muted-foreground mt-3 border-t border-white/10 pt-2">
                      Signed: {r.issuerName}
                      {r.issuerTitle ? `, ${r.issuerTitle}` : ""}
                    </p>
                  )}
                </GlassCard>
              ))}
            </>
          )}
          <h2 className="text-lg font-bold pt-2">M-Pesa payments</h2>
          {(data.payments ?? []).length === 0 ? (
            <GlassCard><p className="text-muted-foreground">No M-Pesa payments recorded yet.</p></GlassCard>
          ) : (data.payments ?? []).map((p) => (
            <GlassCard key={p.id} className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-bold text-gold">KES {p.amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{p.description || p.accountReference}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatPortalDate(p.createdAt)} · {p.phone}</p>
                {p.mpesaReceiptNumber && (
                  <p className="text-xs text-life-green mt-1">Receipt: {p.mpesaReceiptNumber}</p>
                )}
              </div>
              <span className={`capitalize text-sm h-fit ${statusBadge(p.status)}`}>{p.status}</span>
            </GlassCard>
          ))}
          {data.invoices.filter((i) => i.status === "paid").length > 0 && (
            <>
              <h2 className="text-lg font-bold pt-4">Paid invoices</h2>
              {data.invoices.filter((i) => i.status === "paid").map((inv) => (
                <GlassCard key={inv.id} className="flex flex-wrap justify-between gap-3 items-center">
                  <div>
                    <p className="font-medium">{inv.number}</p>
                    <p className="text-sm text-muted-foreground">{inv.projectName}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-gold font-bold">{inv.currency} {inv.amount.toLocaleString()}</p>
                    <Button href={`${portalBase}/invoices`} size="sm" variant="outline">
                      View statement
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </>
          )}
        </div>
      )}

      {section === "points" && (
        <div className="space-y-4">
          <GlassCard className="border-gold/30 text-center py-8">
            <Award className="h-10 w-10 text-gold mx-auto mb-3" />
            <p className="text-4xl font-bold text-gold">{data.user.points.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-2">TechFlare loyalty points</p>
          </GlassCard>
          <GlassCard>
            <h2 className="text-lg font-bold mb-2">How points work</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{company.pointsDescription}</p>
            {!data.user.communityMember && (
              <p className="text-sm mt-4">
                Join our{" "}
                <Button href="/community" variant="ghost" size="sm" className="inline p-0 h-auto">
                  WhatsApp community
                </Button>{" "}
                for extra activities and career opportunities.
              </p>
            )}
          </GlassCard>
        </div>
      )}

      {section === "invoices" && (
        <div className="space-y-3">
          <PaymentDetailsSection />
          <p className="text-sm text-muted-foreground mb-4">
            Invoices from our Finance Office include scope, deliverables, timelines, and payment instructions.
            They are sent to your registered email when a proposal is approved.
          </p>
          {data.invoices.length === 0 ? (
            <GlassCard><p className="text-muted-foreground">No invoices yet. Invoices appear after admin approval and finance processing.</p></GlassCard>
          ) : data.invoices.map((inv) => {
            const wf = inv.workflowId
              ? (data.workflows ?? []).find((w) => w.id === inv.workflowId)
              : (data.workflows ?? []).find((w) => w.financeDocId === inv.id);
            const needsProposal = wf?.status === "SENT_TO_CLIENT" && !wf.clientAgreed;
            const canPay =
              inv.status !== "paid" &&
              wf &&
              (wf.status === "CLIENT_AGREED" || wf.clientAgreed) &&
              !wf.depositPaid;
            const depositPct = wf?.depositPercent ?? 60;
            const depositAmount =
              wf?.financeTotal != null ? Math.round(wf.financeTotal * (depositPct / 100)) : null;

            return (
            <GlassCard key={inv.id}>
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-bold">{inv.number}</p>
                  <p className="text-sm text-muted-foreground">
                    {inv.projectName}
                    {inv.dueDate ? ` · Due ${formatPortalDate(inv.dueDate)}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold">{inv.currency} {inv.amount.toLocaleString()}</p>
                  <span className={`text-sm capitalize ${statusBadge(inv.status)}`}>{inv.status}</span>
                </div>
              </div>
              {needsProposal && wf && (
                <WorkflowProposalActions
                  workflowId={wf.id}
                  title={wf.title}
                  financeDocId={wf.financeDocId}
                  invoiceNumber={inv.number}
                  depositAmount={depositAmount}
                  depositPercent={depositPct}
                  onAgreed={refresh}
                  onDeclined={refresh}
                  onPaid={refresh}
                />
              )}
              <InvoiceDepositBreakdown
                total={parseProjectTotalFromInvoice(inv)}
                currency={inv.currency}
                depositPaid={inv.status === "paid"}
              />
              {inv.notes && (
                <p className="text-xs text-muted-foreground whitespace-pre-wrap mb-2">{inv.notes}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {inv.paymentMethod || "M-Pesa Till 9356451 (TechFlare Solutions)"}
              </p>
              {inv.signed && inv.issuerName && (
                <p className="text-xs text-muted-foreground mt-2 border-t border-white/10 pt-2">
                  Signed: {inv.issuerName}
                  {inv.issuerTitle ? ` · ${inv.issuerTitle}` : ""}
                </p>
              )}
              {canPay && depositAmount != null && wf?.financeDocId && (
                <div className="mt-4 rounded-xl border border-gold/20 bg-deep-blue/40 p-4 text-sm">
                  <InvoiceDepositPayPanel
                    compact
                    invoiceId={wf.financeDocId}
                    invoiceNumber={inv.number}
                    amount={depositAmount}
                    description={`Deposit for ${wf.title}`}
                    onPaid={refresh}
                  />
                </div>
              )}
              {!needsProposal && !canPay && (
                <InvoicePaySection
                  invoiceId={inv.id}
                  invoiceNumber={inv.number}
                  amount={inv.amount}
                  currency={inv.currency}
                  status={inv.status === "pending" ? "sent" : inv.status}
                  onPaid={refresh}
                />
              )}
            </GlassCard>
            );
          })}
        </div>
      )}

      {section === "support" && (
        <div className="space-y-6">
          <SupportTicketPanel onSubmitted={refresh} />
          <h2 className="text-lg font-bold">Your tickets</h2>
          <SupportTicketList tickets={data.tickets} />
        </div>
      )}

      {section === "revisions" && (
        <ClientRevisionsSection data={data} />
      )}

      {section === "documents" && (
        <div className="space-y-6">
          {(data.workflows ?? []).some((w) => w.hodBrief) && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold">Scope documents</h2>
              {(data.workflows ?? [])
                .filter((w) => w.hodBrief)
                .map((w) => (
                  <GlassCard key={w.id}>
                    <p className="font-bold">{w.title}</p>
                    {w.projectNumber && <p className="text-xs text-gold">{w.projectNumber}</p>}
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{w.hodBrief}</p>
                  </GlassCard>
                ))}
            </div>
          )}
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Project files</h2>
          {data.documents.length === 0 ? (
            <GlassCard><p className="text-muted-foreground">No uploaded files yet. Deliverables appear here as your project progresses.</p></GlassCard>
          ) : data.documents.map((d) => (
            <GlassCard key={d.id} className="flex justify-between">
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-sm text-muted-foreground">{d.projectName}</p>
              </div>
              <span className="text-xs text-gold">{d.type}</span>
            </GlassCard>
          ))}
        </div>
        </div>
      )}

      {section === "messages" && (
        <div className="space-y-3">
          {data.notifications.length === 0 ? (
            <GlassCard><p className="text-muted-foreground">No notifications.</p></GlassCard>
          ) : data.notifications.map((n) => (
            <GlassCard key={n.id} className={!n.read ? "border-gold/30" : ""}>
              <div className="flex justify-between mb-1">
                <p className="font-medium">{n.title}</p>
                {!n.read && <MessageSquare className="h-4 w-4 text-gold" />}
              </div>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{formatPortalDate(n.createdAt)}</p>
            </GlassCard>
          ))}
        </div>
      )}
      {section === "testimonials" && (
        <PortalTestimonialForm />
      )}

      {section === "ratings" && (
        <div className="space-y-6">
          <RatingPanel data={data} ratings={data.ratings} onRated={refresh} showEmpty />
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Your ratings</h2>
          {data.ratings.length === 0 ? (
            <GlassCard><p className="text-muted-foreground">You haven&apos;t rated anything yet. Use the form above after we deliver work for you.</p></GlassCard>
          ) : data.ratings.map((r) => (
            <GlassCard key={r.id}>
              <div className="flex justify-between mb-1">
                <p className="font-medium">{r.targetTitle}</p>
                <span className="text-gold">{"★".repeat(r.rating)}</span>
              </div>
              <p className="text-xs text-muted-foreground capitalize">{r.targetType}</p>
              {r.comment && <p className="text-sm mt-2">{r.comment}</p>}
            </GlassCard>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}

function ClientRevisionsSection({ data }: { data: PortalData }) {
  const [history, setHistory] = useState<
    Array<{
      id: string;
      targetType: string;
      targetTitle: string;
      message: string;
      createdAt: string;
    }>
  >([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/me/revisions"), { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { revisions: [] }))
      .then((d) => setHistory(d.revisions ?? []))
      .finally(() => setLoadingHistory(false));
  }, []);

  return (
    <div className="space-y-6">
      <QuickRevisionPanel
        items={buildClientRevisionItems(data)}
        emptyMessage="Submit a project or service request first. When work is active, select it here to request a revision."
      />

      <div>
        <h2 className="text-lg font-bold mb-3">Revision history</h2>
        {loadingHistory ? (
          <GlassCard><p className="text-sm text-muted-foreground">Loading history…</p></GlassCard>
        ) : history.length === 0 ? (
          <GlassCard>
            <p className="text-sm text-muted-foreground">
              No revisions sent yet. When you request a change, it appears here so you can track what you asked for.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {history.map((rev) => (
              <GlassCard key={rev.id}>
                <div className="flex flex-wrap justify-between gap-2 mb-2">
                  <p className="font-medium">{rev.targetTitle}</p>
                  <span className="text-xs text-muted-foreground capitalize">{rev.targetType}</span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{rev.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatPortalDate(rev.createdAt)}</p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
