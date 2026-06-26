"use client";

import { Menu, X, LogOut, Globe } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/site";
import { PORTAL_LABELS } from "@/lib/site-vs-portal";
import { buildEmailComposeLink } from "@/lib/mailto";

type PortalType = "client" | "innovation" | "employee";

const titles: Record<PortalType, string> = {
  client: PORTAL_LABELS.client,
  innovation: PORTAL_LABELS.innovator,
  employee: PORTAL_LABELS.employee,
};

export function PortalHeader({
  type,
  menuOpen,
  onMenuToggle,
}: {
  type: PortalType;
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-life-green/30 bg-black/95 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-gold/10 lg:hidden"
            onClick={onMenuToggle}
            aria-expanded={menuOpen}
            aria-controls="portal-sidebar"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Logo size="xs" href={`/portal/${type === "innovation" ? "innovation" : type}`} showName={false} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-life-green leading-tight">{titles[type]}</p>
            <p className="truncate text-[10px] text-muted-foreground hidden sm:block">
              Private · {company.name}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button href="/" variant="ghost" size="sm" className="hidden sm:inline-flex text-xs">
            <Globe className="h-4 w-4" />
            <span className="hidden lg:inline ml-1">Company website</span>
          </Button>
          <Button
            href={buildEmailComposeLink({ type: "support" })}
            variant="ghost"
            size="sm"
            className="text-xs sm:text-sm"
          >
            Email us
          </Button>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/";
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-white/10 hover:text-red-400"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
