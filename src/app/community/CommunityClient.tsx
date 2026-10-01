"use client";

import { useState } from "react";
import { Users, MessageCircle, Award, Mail } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthGate";
import { company, accountVsCommunity } from "@/data/site";

export function CommunityClient() {
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function confirmMembership() {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/community/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ communityEmail: email }),
      });
      if (res.ok) setConfirmed(true);
      else alert("Please sign in first, then confirm membership.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        badge="Community"
        title="Join Our Community"
        subtitle="Separate from your website account — a WhatsApp community for innovation, careers, and updates"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="border-gold/30">
              <h2 className="text-xl font-bold text-gold mb-3">{accountVsCommunity.accountTitle}</h2>
              <p className="text-sm text-muted-foreground">{accountVsCommunity.accountDescription}</p>
              <Button href="/register" variant="outline" size="sm" className="mt-4">Create Account</Button>
            </GlassCard>
            <GlassCard className="border-life-green/30">
              <h2 className="text-xl font-bold text-life-green mb-3">{accountVsCommunity.communityTitle}</h2>
              <p className="text-sm text-muted-foreground">{accountVsCommunity.communityDescription}</p>
              <Button href={company.communityWhatsApp} variant="secondary" size="sm" className="mt-4">
                <MessageCircle className="h-4 w-4" /> Join WhatsApp
              </Button>
            </GlassCard>
          </div>

          <GlassCard>
            <h2 className="text-xl font-bold mb-4">How to Join</h2>
            <ol className="space-y-3">
              {accountVsCommunity.communitySteps.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold text-xs font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </GlassCard>

          <GlassCard className="border-gold/20">
            <Award className="h-8 w-8 text-gold mb-3" />
            <h2 className="text-xl font-bold mb-2">Client Reward Points</h2>
            <p className="text-sm text-muted-foreground">{company.pointsDescription}</p>
          </GlassCard>

          <GlassCard>
            <Users className="h-8 w-8 text-life-green mb-3" />
            <h2 className="text-xl font-bold mb-4">Confirm Community Membership</h2>
            <p className="text-sm text-muted-foreground mb-4">
              After joining WhatsApp, share your email in the group for notifications. Then confirm here (requires signed-in account).
            </p>
            {confirmed || user?.communityMember ? (
              <p className="text-life-green font-semibold">You are a verified community member.</p>
            ) : isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email shared in WhatsApp group"
                  className="flex-1 rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3"
                />
                <Button onClick={confirmMembership} disabled={loading || !email}>
                  <Mail className="h-4 w-4" /> Confirm
                </Button>
              </div>
            ) : (
              <Button href="/login?redirect=/community">Sign In to Confirm</Button>
            )}
          </GlassCard>
        </div>
      </section>
    </>
  );
}
