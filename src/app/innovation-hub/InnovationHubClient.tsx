"use client";

import { useState } from "react";
import { Lightbulb, FlaskConical, Briefcase, CheckCircle2, Upload, ArrowRight } from "lucide-react";
import { AuthGate } from "@/components/auth/AuthGate";
import { innovationWorkflow } from "@/data/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

const ideaTypes = [
  { id: "idea", label: "Idea", icon: Lightbulb, description: "A concept or improvement you'd like to explore" },
  { id: "invention", label: "Invention", icon: FlaskConical, description: "A novel invention or technical innovation" },
  { id: "business_concept", label: "Business Concept", icon: Briefcase, description: "A business model or venture concept" },
];

export function InnovationHubClient() {
  const [form, setForm] = useState({
    type: "idea",
    title: "",
    category: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setTrackingId(data.id);
        setSubmitted(true);
      }
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        badge="Centerpiece"
        title="Innovation Hub"
        subtitle="Bring us your problem or idea — we'll research it, validate it, build it, and help turn it into a successful solution."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Workflow */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid gap-4 md:grid-cols-5">
              {innovationWorkflow.map((step, i) => (
                <GlassCard key={step.step} delay={i * 0.1} className="text-center relative">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold to-deep-blue-mid font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                  {i < innovationWorkflow.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gold/40" />
                  )}
                </GlassCard>
              ))}
            </div>
          </div>

          <AuthGate
            redirectPath="/innovation-hub"
            title="Sign In to Submit Your Idea"
            description="Browse the Innovation Hub freely. To submit ideas, inventions, or business concepts, create a free TechFlare Solutions account first."
          >
          {submitted ? (
            <GlassCard className="max-w-2xl mx-auto text-center border-green-500/30">
              <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Idea Submitted Successfully!</h2>
              <p className="text-muted-foreground mb-4">
                Your submission is now in our research review queue.
              </p>
              <p className="text-sm">
                Tracking ID: <code className="text-gold">{trackingId}</code>
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button href="/portal/innovation">Track in Portal</Button>
                <Button variant="outline" onClick={() => { setSubmitted(false); setTrackingId(""); }}>
                  Submit Another
                </Button>
              </div>
            </GlassCard>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Type Selection */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-xl font-bold">What are you submitting?</h2>
                {ideaTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setForm({ ...form, type: type.id })}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${
                      form.type === type.id
                        ? "border-gold bg-gold/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <type.icon className={`h-6 w-6 mb-2 ${form.type === type.id ? "text-gold" : ""}`} />
                    <h3 className="font-semibold">{type.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                  </button>
                ))}

                <GlassCard className="border-gold/20">
                  <h3 className="font-semibold mb-2">Already registered?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Log in to the Innovation Portal to track submissions, upload prototypes, and sign agreements.
                  </p>
                  <Button href="/portal/innovation" variant="outline" size="sm" className="w-full">
                    Innovation Portal
                  </Button>
                </GlassCard>
              </div>

              {/* Submission Form */}
              <GlassCard className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-6">Submit Your {ideaTypes.find((t) => t.id === form.type)?.label}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Title</label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Give your idea a compelling title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Category</label>
                    <select
                      required
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="">Select a category</option>
                      <option value="ai">Artificial Intelligence</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="fintech">Fintech</option>
                      <option value="iot">IoT & Hardware</option>
                      <option value="blockchain">Blockchain</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Description</label>
                    <textarea
                      required
                      rows={6}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                      placeholder="Describe your idea in detail. What problem does it solve? Who benefits? What makes it unique?"
                    />
                  </div>

                  <div className="rounded-xl border border-dashed border-white/20 p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Document uploads available after registration in the{" "}
                      <a href="/portal/innovation" className="text-gold hover:underline">Innovation Portal</a>
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit to Innovation Hub"}
                  </Button>
                </form>
              </GlassCard>
            </div>
          )}
          </AuthGate>
        </div>
      </section>
    </>
  );
}
