"use client";

import { useEffect, useState } from "react";
import { Lock, LogIn, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/site";

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
      <GlassCard className="max-w-xl mx-auto text-center border-gold/30 py-12 px-8">
        <Lock className="h-12 w-12 text-gold mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <p className="text-sm text-muted-foreground mb-6">
          Browsing {company.name} is open to everyone. To submit ideas, use AI tools, or access client resources — sign in first.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href={loginHref}>
            <LogIn className="h-4 w-4" /> Sign In
          </Button>
          <Button href="/register" variant="outline">Create Account</Button>
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
