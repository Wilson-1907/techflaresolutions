"use client";

import { useEffect, useState } from "react";
import { Lock, LogIn, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { company, accountVsCommunity } from "@/data/site";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  points?: number;
  communityMember?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((d) => setUser(d.authenticated ? d.user : null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, isAuthenticated: !!user };
}

interface AuthGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  requireCommunity?: boolean;
  redirectPath?: string;
}

export function AuthGate({
  children,
  title = "Sign In Required",
  description = "Create a free TechFlare Solutions account to access this feature. Join our community separately via WhatsApp for careers and group activities.",
  requireCommunity = false,
  redirectPath,
}: AuthGateProps) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <GlassCard className="max-w-xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Checking your session...</p>
      </GlassCard>
    );
  }

  if (!isAuthenticated) {
    const loginHref = redirectPath
      ? `/login?redirect=${encodeURIComponent(redirectPath)}`
      : "/login";

    return (
      <GlassCard className="max-w-2xl mx-auto border-gold/30 py-10 px-6 sm:py-12 sm:px-10">
        <div className="text-center">
          <Lock className="h-12 w-12 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
        </div>
        <p className="text-sm font-semibold text-gold mb-3">{accountVsCommunity.accountTitle}</p>
        <ul className="mb-8 space-y-2.5 text-sm text-muted-foreground">
          {accountVsCommunity.accountReasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span className="text-life-green shrink-0">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mb-6 text-center">
          Browsing {company.name} is open to everyone. Sign in to use your private portal and tools.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href={loginHref} size="lg">
            <LogIn className="h-4 w-4" /> {accountVsCommunity.accountCta}
          </Button>
          <Button href="/register" variant="outline" size="lg">
            Create account
          </Button>
        </div>
      </GlassCard>
    );
  }

  if (requireCommunity && !user?.communityMember) {
    return (
      <GlassCard className="max-w-xl mx-auto text-center border-life-green/30 py-12 px-8">
        <Users className="h-12 w-12 text-life-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Community Membership Required</h2>
        <p className="text-muted-foreground mb-4">
          Your account and our community are separate. Join our WhatsApp community, share your email for notifications, then confirm membership on the Community page.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/community">Join Community</Button>
          <Button href={company.communityWhatsApp} variant="secondary">
            Open WhatsApp Group
          </Button>
        </div>
      </GlassCard>
    );
  }

  return <>{children}</>;
}
