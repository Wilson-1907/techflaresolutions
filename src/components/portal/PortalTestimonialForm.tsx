"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formSelectClass } from "@/lib/form-styles";
import { apiUrl } from "@/lib/api-base";
import { SubmissionSuccessCard } from "./SubmissionSuccessMessage";

export function PortalTestimonialForm() {
  const [form, setForm] = useState({ content: "", rating: 5, company: "", authorTitle: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/testimonials"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setDone(true);
      setForm({ content: "", rating: 5, company: "", authorTitle: "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <SubmissionSuccessCard
        detail="Your testimonial is with our team. Please wait — you will see approved or rejected. If approved, it may appear on the public homepage."
      />
    );
  }

  return (
    <GlassCard className="border-gold/20">
      <h2 className="text-lg font-bold mb-2">Share your experience</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Not the company blog — this is your personal testimonial. After admin approval it may appear on the public
        homepage.
      </p>
      {error && (
        <p className="text-sm mb-4 text-red-400">{error}</p>
      )}
      <form onSubmit={submit} className="space-y-4">
        <input
          value={form.authorTitle}
          onChange={(e) => setForm({ ...form, authorTitle: e.target.value })}
          placeholder="Your role (e.g. CEO, Innovator)"
          className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-3 text-sm"
        />
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Company or project name"
          className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-3 text-sm"
        />
        <textarea
          required
          minLength={20}
          maxLength={1000}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="What was your experience with TechFlare?"
          rows={4}
          className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-3 text-sm resize-none"
        />
        <div className="flex items-center gap-3">
          <Star className="h-4 w-4 text-gold" aria-hidden />
          <label className="text-sm">Rating</label>
          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className={`${formSelectClass} text-sm py-2`}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} stars
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit testimonial"}
        </Button>
      </form>
    </GlassCard>
  );
}
