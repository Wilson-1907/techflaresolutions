"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { industries } from "@/data/site";
import { formSelectClass } from "@/lib/form-styles";
import { apiUrl } from "@/lib/api-base";
import { SUBMISSION_HINT, SUBMISSION_LIMITS } from "@/lib/submission-limits";
import { SubmissionPaymentNotice } from "./SubmissionPaymentNotice";
import { SubmissionSuccessCard } from "./SubmissionSuccessMessage";

const budgetOptions = [
  { value: "under-500k", label: "Under KES 500,000" },
  { value: "500k-2m", label: "KES 500,000 – 2M" },
  { value: "2m-10m", label: "KES 2M – 10M" },
  { value: "10m-plus", label: "KES 10M+" },
  { value: "discuss", label: "Let's discuss" },
];

const timelineOptions = [
  { value: "urgent", label: "Urgent (under 1 month)" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-plus", label: "6+ months" },
  { value: "flexible", label: "Flexible" },
];

const ideaTypes = [
  { id: "idea", label: "Idea" },
  { id: "invention", label: "Invention" },
  { id: "business_concept", label: "Business concept" },
] as const;

export function ClientRequestForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({ problem: "", industry: "", budget: "", timeline: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <SubmissionSuccessCard
        trackLabel="Track my requests"
        trackHref="/portal/client/services"
        detail="Track status under My requests. Our team will review your submission — please wait for a response. You will see approved or rejected, and we will email you if approved with next steps."
      />
    );
  }

  return (
    <GlassCard className="border-gold/20">
      <h2 className="text-lg font-bold mb-1">Submit a project request</h2>
      <p className="text-sm text-muted-foreground mb-4">{SUBMISSION_HINT}</p>
      <SubmissionPaymentNotice />
      {error && (
        <p className="text-sm text-red-400 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">What do you need?</label>
          <textarea
            required
            rows={4}
            maxLength={SUBMISSION_LIMITS.solutionProblemMax}
            value={form.problem}
            onChange={(e) => setForm({ ...form, problem: e.target.value })}
            placeholder="Problem, who it helps, and outcome you need — keep it brief but complete."
            className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {form.problem.length}/{SUBMISSION_LIMITS.solutionProblemMax} characters
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Industry</label>
            <select
              required
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className={formSelectClass}
            >
              <option value="">Select</option>
              {industries.map((i) => (
                <option key={i.slug} value={i.slug}>{i.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Budget</label>
            <select
              required
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className={formSelectClass}
            >
              <option value="">Select</option>
              {budgetOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Timeline</label>
            <select
              required
              value={form.timeline}
              onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              className={formSelectClass}
            >
              <option value="">Select</option>
              {timelineOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit request"}
        </Button>
      </form>
    </GlassCard>
  );
}

export function InnovatorIdeaForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    type: "idea" as (typeof ideaTypes)[number]["id"],
    title: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/ideas"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <SubmissionSuccessCard
        trackLabel="Track my ideas"
        trackHref="/portal/innovation/tracking"
        detail="Track progress under Track submissions. Our team will review your idea — please wait for a response. You will see approved or rejected, and we will email you if approved."
      />
    );
  }

  return (
    <GlassCard className="border-gold/20">
      <h2 className="text-lg font-bold mb-1">Submit your idea</h2>
      <p className="text-sm text-muted-foreground mb-4">{SUBMISSION_HINT}</p>
      <SubmissionPaymentNotice />
      {error && (
        <p className="text-sm text-red-400 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="flex flex-wrap gap-2">
            {ideaTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm({ ...form, type: t.id })}
                className={`rounded-xl px-4 py-2 text-sm border transition-colors ${
                  form.type === t.id
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-gold/20 text-muted-foreground hover:border-gold/40"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            required
            maxLength={SUBMISSION_LIMITS.ideaTitleMax}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Clear, short title"
            className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Category</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={formSelectClass}
          >
            <option value="">Select category</option>
            {industries.map((i) => (
              <option key={i.slug} value={i.slug}>{i.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            required
            rows={5}
            minLength={SUBMISSION_LIMITS.ideaDescriptionMin}
            maxLength={SUBMISSION_LIMITS.ideaDescriptionMax}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What is it, who benefits, and what support you need — short but complete."
            className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {form.description.length}/{SUBMISSION_LIMITS.ideaDescriptionMax} characters
          </p>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit idea"}
        </Button>
      </form>
    </GlassCard>
  );
}
