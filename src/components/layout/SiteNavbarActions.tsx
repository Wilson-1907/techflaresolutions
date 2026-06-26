"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getPortalPathForRole } from "@/lib/portal-routes";
import type { AuthUser } from "@/lib/auth";

export function SiteNavbarActions({ mobile, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return <span className="h-9 w-24" aria-hidden />;
  }

  if (user) {
    const workspace = getPortalPathForRole(user.role);
    return (
      <Button
        href={workspace}
        size="sm"
        className={mobile ? "w-full" : undefined}
        variant={mobile ? "outline" : "primary"}
        onClick={onNavigate}
      >
        My workspace
      </Button>
    );
  }

  return (
    <>
      <Button
        href="/login"
        variant="ghost"
        size="sm"
        className={mobile ? "w-full" : "hidden sm:inline-flex"}
        onClick={onNavigate}
      >
        Sign in
      </Button>
      <Button
        href="/login?redirect=/portal/innovation/submit"
        size="sm"
        className={mobile ? "w-full" : "hidden sm:inline-flex"}
        onClick={onNavigate}
      >
        Join as innovator
      </Button>
    </>
  );
}
