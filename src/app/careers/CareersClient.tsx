"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { AuthGate, useAuth } from "@/components/auth/AuthGate";
import {
  Briefcase,
  HeartHandshake,
  MapPin,
  Clock,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Users,
  ShieldCheck,
} from "lucide-react";
import { company } from "@/data/site";
import { hiringStatus } from "@/data/hiring";
import type { JobPosition } from "@/lib/jobs-client";
import { fetchJobPositionsClient } from "@/lib/jobs-client";

const typeLabels: Record<string, string> = {
  full_time: "Full Time",
  internship: "Internship",
  graduate: "Graduate Program",
};

export function CareersClient({ positions: initialPositions }: { positions: JobPosition[] }) {
  const { user, isAuthenticated } = useAuth();
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
  const [error, setError] = useState("");

  const hiringOpen = hiringStatus.open;
  const showRoles = hiringOpen && positions.length > 0;
  const isCommunityMember = Boolean(user?.communityMember);

  useEffect(() => {
    fetchJobPositionsClient().then((jobs) => {
      if (jobs.length > 0) setPositions(jobs);
    });
  }, []);

  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({
        ...prev,
        applicantEmail: prev.applicantEmail || user.email,
        applicantName:
          prev.applicantName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        communityConfirmed: Boolean(user.communityMember),
      }));
    }
  }, [user]);

  function startApply(jobTitle: string) {
    setError("");
    setSubmitted(false);

    if (!isAuthenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent("/careers")}`;
      return;
    }

    if (!isCommunityMember) {
      setApplyJob(null);
      setError("Join and confirm community membership before applying.");
      return;
    }

    setApplyJob(jobTitle);
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isCommunityMember || !form.communityConfirmed) {
      setError("You must join the community and confirm membership before applying.");
      return;
    }

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
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubmitted(true);
      } else if (data.code === "COMMUNITY_REQUIRED" || res.status === 403) {
        setError(
          data.error ||
            "Join the WhatsApp community and confirm at /community before applying."
        );
        setApplyJob(null);
      } else {
        setError(data.error || "Application failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Careers at TechFlare Solutions"
        subtitle="Community membership is required before you can apply"
        badge="Careers"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-10">
          <GlassCard className="border-life-green/30 bg-life-green/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <ShieldCheck className="h-8 w-8 shrink-0 text-life-green" />
              <div className="space-y-3">
                <h2 className="font-display text-xl font-semibold">
                  Before you apply: join the community
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Career applications are only open to confirmed TechFlare Solutions community members.
                  Create an account, join our WhatsApp group, share your email there, then confirm
                  membership on the Community page. Apply buttons stay locked until that is done.
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Create / sign in to your TechFlare account</li>
                  <li>2. Join the WhatsApp community and share your email in the group</li>
                  <li>3. Confirm membership at /community</li>
                  <li>4. Return here to apply when roles are open</li>
                </ol>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button href="/community" size="sm">
                    <Users className="h-4 w-4" />
                    {isCommunityMember ? "Community confirmed" : "Join & confirm community"}
                  </Button>
                  <Button href={company.communityWhatsApp} variant="secondary" size="sm">
                    <MessageCircle className="h-4 w-4" />
                    Open WhatsApp
                  </Button>
                  {!isAuthenticated && (
                    <Button href="/login?redirect=/careers" variant="outline" size="sm">
                      Sign in
                    </Button>
                  )}
                </div>
                {isAuthenticated && (
                  <p className="text-xs">
                    Status:{" "}
                    <strong className={isCommunityMember ? "text-life-green" : "text-gold"}>
                      {isCommunityMember
                        ? "Community member — eligible to apply when roles open"
                        : "Not confirmed — join community before applying"}
                    </strong>
                  </p>
                )}
              </div>
            </div>
          </GlassCard>

          {!hiringOpen && (
            <GlassCard className="relative overflow-hidden border-cyan-400/20 text-center py-14 px-6">
              <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
              <div className="relative mx-auto max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  <Briefcase className="h-3.5 w-3.5" />
                  Talent status
                </span>
                <h2 className="mt-6 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
                  {hiringStatus.headline}
                </h2>
                <p className="mt-3 text-gold text-lg">{hiringStatus.subheadline}</p>
                <p className="mt-5 text-muted-foreground leading-relaxed">{hiringStatus.body}</p>
                <p className="mt-4 text-sm text-muted-foreground">{hiringStatus.nextReviewNote}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button href="/community" size="lg">
                    <Users className="h-5 w-5" />
                    Join community first
                  </Button>
                  <Button href="/contact" variant="outline" size="lg">
                    Contact us
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Build with purpose",
                text: "We ship research-backed software, AI, and automation — not throwaway demos.",
              },
              {
                icon: HeartHandshake,
                title: "Community first",
                text: "No community membership, no application. Members hear about roles first.",
              },
              {
                icon: Briefcase,
                title: "Kenya & remote-ready",
                text: `Based in ${company.offices.map((o) => o.city).join(" & ")}, collaborating with partners beyond.`,
              },
            ].map((item) => (
              <GlassCard key={item.title} className="text-left">
                <item.icon className="h-6 w-6 text-gold mb-3" />
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </GlassCard>
            ))}
          </div>

          {hiringOpen && (
            <div>
              <h2 className="text-2xl font-bold mb-8">Open positions</h2>
              {!showRoles ? (
                <GlassCard className="text-center py-12">
                  <p className="text-muted-foreground">
                    No open positions listed yet. Join the community so you are ready when roles appear.
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
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {pos.location}
                            </span>
                            <span className="flex items-center gap-1">
                              {pos.type === "graduate" ? (
                                <GraduationCap className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              {typeLabels[pos.type] || pos.type}
                            </span>
                          </div>
                          {pos.description && (
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                              {pos.description}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => startApply(pos.title)}
                          disabled={!isCommunityMember}
                        >
                          {isCommunityMember ? "Apply now" : "Community required"}
                        </Button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <GlassCard className="border-orange-500/30 bg-orange-500/5">
              <p className="text-sm text-orange-200">
                {error}{" "}
                <Link href="/community" className="text-gold hover:underline">
                  Go to Community →
                </Link>
              </p>
            </GlassCard>
          )}

          {applyJob && isCommunityMember && (
            <AuthGate
              requireCommunity
              redirectPath="/careers"
              title="Community required to apply"
              description="Sign in, join the WhatsApp community, and confirm membership before submitting a career application."
            >
              {submitted ? (
                <GlassCard className="text-center">
                  <h3 className="text-xl font-bold text-life-green">Application submitted</h3>
                  <p className="text-muted-foreground mt-2">
                    We will review your application and contact you by email.
                  </p>
                </GlassCard>
              ) : (
                <GlassCard>
                  <h3 className="text-xl font-bold mb-2">Apply: {applyJob}</h3>
                  <p className="text-sm text-life-green mb-4">
                    Community membership verified — you can submit this application.
                  </p>
                  <form onSubmit={handleApply} className="space-y-4">
                    <input
                      required
                      placeholder="Full name"
                      value={form.applicantName}
                      onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
                      className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={form.applicantEmail}
                      onChange={(e) => setForm({ ...form, applicantEmail: e.target.value })}
                      className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3"
                    />
                    <input
                      placeholder={`Phone (${company.phone})`}
                      value={form.applicantPhone}
                      onChange={(e) => setForm({ ...form, applicantPhone: e.target.value })}
                      className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3"
                    />
                    <textarea
                      required
                      rows={5}
                      minLength={50}
                      placeholder="Cover letter (min 50 characters)"
                      value={form.coverLetter}
                      onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                      className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 resize-none"
                    />
                    <label className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        required
                        checked={form.communityConfirmed}
                        onChange={(e) =>
                          setForm({ ...form, communityConfirmed: e.target.checked })
                        }
                        className="mt-1"
                      />
                      I am an active, confirmed member of the TechFlare Solutions WhatsApp community
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" disabled={loading || !form.communityConfirmed}>
                        {loading ? "Submitting..." : "Submit application"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setApplyJob(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </GlassCard>
              )}
            </AuthGate>
          )}

          {!hiringOpen && (
            <GlassCard className="border-dashed border-white/15 text-center py-10">
              <p className="text-sm text-muted-foreground">
                Open positions: <strong className="text-foreground">none at this time</strong>. When
                hiring reopens, only confirmed community members can apply.{" "}
                <Link href="/community" className="text-gold hover:underline">
                  Join the community now
                </Link>
                .
              </p>
            </GlassCard>
          )}
        </div>
      </section>
    </>
  );
}
