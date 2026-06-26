"use client";

import { useState } from "react";
import { Sparkles, Wand2, Calculator, Users, Bot } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { AuthGate } from "@/components/auth/AuthGate";
import { AiSessionGate } from "@/components/ai/AiSessionGate";
import { company, industries } from "@/data/site";
import { formSelectClass } from "@/lib/form-styles";
import { SUBMISSION_HINT, SUBMISSION_LIMITS } from "@/lib/submission-limits";

export function SolutionsClient() {
  const [form, setForm] = useState({
    problem: "",
    budget: "",
    industry: "",
    timeline: "",
  });
  const [aiProposal, setAiProposal] = useState("");
  const [aiCost, setAiCost] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<"team" | "ai">("team");

  async function generateProposal() {
    if (!form.problem) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ problem: form.problem, industry: form.industry, budget: form.budget }),
      });
      const data = await res.json();
      if (res.status === 402) {
        alert(data.message || "Pay KES 100 via M-Pesa to unlock AI.");
        return;
      }
      if (!res.ok) throw new Error(data.error);
      setAiProposal(data.proposal);
      setAiCost(data.estimatedCost);
    } catch (e) {
      setAiProposal(e instanceof Error ? e.message : "Unable to generate proposal.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const problemFields = (
    <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Describe Your Problem</label>
                    <textarea
          required={mode === "team"}
                      rows={5}
          maxLength={SUBMISSION_LIMITS.solutionProblemMax}
                      value={form.problem}
                      onChange={(e) => setForm({ ...form, problem: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
          placeholder="Problem, goals, and outcome — short but complete."
                    />
        <p className="text-xs text-muted-foreground mt-1">{SUBMISSION_HINT}</p>
        <p className="text-xs text-muted-foreground text-right">{form.problem.length}/{SUBMISSION_LIMITS.solutionProblemMax}</p>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Industry</label>
                      <select
                        value={form.industry}
                        onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className={formSelectClass}
                      >
                        <option value="">Select</option>
                        {industries.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.title}
              </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Budget</label>
                      <select
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
            className={formSelectClass}
                      >
                        <option value="">Select</option>
                        <option value="under-10k">Under $10,000</option>
                        <option value="10k-50k">$10,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="100k-plus">$100,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Timeline</label>
                      <select
                        value={form.timeline}
                        onChange={(e) => setForm({ ...form, timeline: e.target.value })}
            className={formSelectClass}
                      >
                        <option value="">Select</option>
                        <option value="urgent">Urgent (&lt; 1 month)</option>
                        <option value="short">1-3 months</option>
                        <option value="medium">3-6 months</option>
                        <option value="long">6+ months</option>
                      </select>
                    </div>
      </div>
    </>
  );

  return (
    <>
      <PageHeader
        title="Solutions Center"
        subtitle="Work with our team or use self-service AI — your choice"
        badge="Solve My Problem"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <GlassCard className="mb-8 border-gold/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-gold">{company.name}</strong> — Two paths:{" "}
              <strong>submit to our team</strong> for full research & delivery, or{" "}
              <strong>AI only (KES 100 / 12 hours)</strong> to generate proposals yourself without team involvement.
            </p>
          </GlassCard>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setMode("team")}
              className={`rounded-2xl border p-5 text-left transition-all ${
                mode === "team" ? "border-gold bg-gold/10" : "border-white/10 bg-white/5"
              }`}
            >
              <Users className={`h-6 w-6 mb-2 ${mode === "team" ? "text-gold" : ""}`} />
              <h3 className="font-semibold">Involve our team</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Submit your challenge — we research, propose, and deliver. No AI fee.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("ai")}
              className={`rounded-2xl border p-5 text-left transition-all ${
                mode === "ai" ? "border-gold bg-gold/10" : "border-white/10 bg-white/5"
              }`}
            >
              <Bot className={`h-6 w-6 mb-2 ${mode === "ai" ? "text-gold" : ""}`} />
              <h3 className="font-semibold">AI only — KES 100</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Use our AI Proposal Generator on your own. 12-hour session via M-Pesa.
              </p>
            </button>
                  </div>

          <AuthGate
            redirectPath="/solutions"
            title="Sign In to Use Solutions Center"
            description="Submit challenges or use the paid AI Proposal Generator."
          >
            {submitted && mode === "team" ? (
              <GlassCard className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
                <p className="text-muted-foreground">
                  Our solutions team will analyze your problem and send a detailed proposal within 48 hours.
                </p>
                <Button href="/solutions" variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                  Submit Another
                </Button>
              </GlassCard>
            ) : mode === "team" ? (
              <div className="grid lg:grid-cols-3 gap-8">
                <GlassCard className="lg:col-span-2">
                  <h2 className="text-xl font-bold mb-6">Submit to Our Team</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {problemFields}
                    <Button type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </GlassCard>
                <GlassCard>
                  <h3 className="font-semibold mb-3">What Happens Next?</h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li>1. Our team reviews your challenge</li>
                    <li>2. We conduct preliminary research</li>
                    <li>3. You receive a tailored proposal</li>
                    <li>4. Discovery call & kickoff</li>
                  </ol>
                </GlassCard>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <GlassCard className="lg:col-span-2">
                  <h2 className="text-xl font-bold mb-2">AI Proposal Generator</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    No team involvement — pay KES 100, get 12 hours of AI-generated proposals for your challenge.
                  </p>
                  <AiSessionGate
                    featureLabel="AI Proposal Generator"
                    preview={<div className="space-y-5">{problemFields}</div>}
                  >
                    <div className="space-y-5">
                      {problemFields}
                      <Button
                        type="button"
                        onClick={generateProposal}
                        disabled={loading || !form.problem}
                      >
                      <Wand2 className="h-4 w-4" />
                        {loading ? "Generating..." : "Generate AI Proposal"}
                    </Button>
                  </div>
                  </AiSessionGate>
              </GlassCard>
              <div className="space-y-6">
                {aiProposal && (
                  <GlassCard className="border-life-green/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-life-green" />
                      <h3 className="font-semibold">AI Proposal</h3>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiProposal}</p>
                    {aiCost && (
                      <div className="mt-4 flex items-center gap-2 text-gold">
                        <Calculator className="h-4 w-4" />
                        <span className="text-sm font-semibold">Est. Cost: {aiCost}</span>
                      </div>
                    )}
                  </GlassCard>
                )}
                </div>
            </div>
          )}
          </AuthGate>
        </div>
      </section>
    </>
  );
}
