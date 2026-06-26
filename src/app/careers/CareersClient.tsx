"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { AuthGate } from "@/components/auth/AuthGate";
import { MapPin, Clock, GraduationCap } from "lucide-react";
import { company } from "@/data/site";
import type { JobPosition } from "@/lib/jobs-client";
import { fetchJobPositionsClient } from "@/lib/jobs-client";

const typeLabels: Record<string, string> = {
  full_time: "Full Time",
  internship: "Internship",
  graduate: "Graduate Program",
};

export function CareersClient({ positions: initialPositions }: { positions: JobPosition[] }) {
  const [positions, setPositions] = useState(initialPositions);
  const [applyJob, setApplyJob] = useState<string | null>(null);
  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    coverLetter: "",
    communityConfirmed: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobPositionsClient().then((jobs) => {
      if (jobs.length > 0) setPositions(jobs);
    });
  }, []);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: applyJob,
          ...form,
          communityConfirmed: true,
          website: "",
        }),
      });
      if (res.ok) setSubmitted(true);
      else {
        const data = await res.json();
        alert(data.error || "Application failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Careers at TechFlare Solutions"
        subtitle="Join our community first — then apply to build the future with us"
        badge="Join Us"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-16">
          <GlassCard className="border-gold/20">
            <p className="text-muted-foreground leading-relaxed">
              {company.name} is based in {company.country} with offices in {company.offices.map((o) => o.city).join(" and ")}.
              Career applications require community membership — join our WhatsApp group, share your email, and confirm on the Community page.
            </p>
          </GlassCard>

          <div>
            <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
            {positions.length === 0 ? (
              <GlassCard className="text-center py-12">
                <p className="text-muted-foreground">
                  No open positions at the moment. Check back soon or join our community for updates.
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {positions.map((pos) => (
                  <GlassCard key={pos.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{pos.title}</h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="text-gold/90 font-medium">{pos.department}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{pos.location}</span>
                          <span className="flex items-center gap-1">
                            {pos.type === "graduate" ? <GraduationCap className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {typeLabels[pos.type]}
                          </span>
                        </div>
                        {pos.description && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{pos.description}</p>
                        )}
                      </div>
                      <Button size="sm" onClick={() => { setApplyJob(pos.title); setSubmitted(false); }}>
                        Apply Now
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          {applyJob && (
            <AuthGate requireCommunity redirectPath="/careers" title="Community Required to Apply">
              {submitted ? (
                <GlassCard className="text-center">
                  <h3 className="text-xl font-bold text-life-green">Application Submitted!</h3>
                  <p className="text-muted-foreground mt-2">We will review your application and contact you via email.</p>
                </GlassCard>
              ) : (
                <GlassCard>
                  <h3 className="text-xl font-bold mb-4">Apply: {applyJob}</h3>
                  <form onSubmit={handleApply} className="space-y-4">
                    <input required placeholder="Full name" value={form.applicantName} onChange={(e) => setForm({ ...form, applicantName: e.target.value })} className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3" />
                    <input required type="email" placeholder="Email" value={form.applicantEmail} onChange={(e) => setForm({ ...form, applicantEmail: e.target.value })} className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3" />
                    <input placeholder={`Phone (${company.phone})`} value={form.applicantPhone} onChange={(e) => setForm({ ...form, applicantPhone: e.target.value })} className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3" />
                    <textarea required rows={5} placeholder="Cover letter (min 50 characters)" value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 resize-none" />
                    <label className="flex items-start gap-2 text-sm">
                      <input type="checkbox" required checked={form.communityConfirmed} onChange={(e) => setForm({ ...form, communityConfirmed: e.target.checked })} className="mt-1" />
                      I am an active member of the TechFlare Solutions WhatsApp community
                    </label>
                    <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Application"}</Button>
                  </form>
                </GlassCard>
              )}
            </AuthGate>
          )}
        </div>
      </section>
    </>
  );
}
