"use client";

import { useState } from "react";
import { Sparkles, Wand2, Calculator } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { AuthGate } from "@/components/auth/AuthGate";
import { company, industries } from "@/data/site";

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

  async function generateProposal() {
    if (!form.problem) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: form.problem, industry: form.industry, budget: form.budget }),
      });
      const data = await res.json();
      setAiProposal(data.proposal);
      setAiCost(data.estimatedCost);
    } catch {
      setAiProposal("Unable to generate proposal. Please submit the form and our team will respond.");
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
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Solutions Center"
        subtitle="Describe your challenge — we'll research and propose the best solution"
        badge="Solve My Problem"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <GlassCard className="mb-8 border-gold/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-gold">{company.name}</strong> — Browse freely. To submit challenges or use our AI Proposal Generator, sign in to your account. 
              Ordering built-in products from our catalog does not require an account.
            </p>
          </GlassCard>

          <AuthGate
            redirectPath="/solutions"
            title="Sign In to Use Solutions Center"
            description="Submit your problem, get AI-generated proposals, and access our solutions team. Create a free account — community membership is separate."
          >
          {submitted ? (
            <GlassCard className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
              <p className="text-muted-foreground">
                Our solutions team will analyze your problem and send a detailed proposal within 48 hours.
              </p>
              <Button href="/solutions" variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                Submit Another
              </Button>
            </GlassCard>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <GlassCard className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-6">Tell Us Your Challenge</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Describe Your Problem</label>
                    <textarea
                      required
                      rows={5}
                      value={form.problem}
                      onChange={(e) => setForm({ ...form, problem: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                      placeholder="What challenge are you facing? What outcome do you need?"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Industry</label>
                      <select
                        required
                        value={form.industry}
                        onChange={(e) => setForm({ ...form, industry: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
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
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
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
                        required
                        value={form.timeline}
                        onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        <option value="">Select</option>
                        <option value="urgent">Urgent (&lt; 1 month)</option>
                        <option value="short">1-3 months</option>
                        <option value="medium">3-6 months</option>
                        <option value="long">6+ months</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Request"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={generateProposal} disabled={loading || !form.problem}>
                      <Wand2 className="h-4 w-4" />
                      AI Proposal Generator
                    </Button>
                  </div>
                </form>
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

                <GlassCard>
                  <h3 className="font-semibold mb-3">What Happens Next?</h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li>1. Our team reviews your challenge</li>
                    <li>2. We conduct preliminary research</li>
                    <li>3. You receive a tailored proposal</li>
                    <li>4. We schedule a discovery call</li>
                    <li>5. Project kickoff upon agreement</li>
                  </ol>
                </GlassCard>
              </div>
            </div>
          )}
          </AuthGate>
        </div>
      </section>
    </>
  );
}
