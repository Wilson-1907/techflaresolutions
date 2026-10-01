"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, FileText, MessageSquare,
  Lightbulb, HeadphonesIcon, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/data/site";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const clientNav: NavItem[] = [
  { href: "/portal/client", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/client/projects", label: "Projects", icon: FolderKanban },
  { href: "/portal/client/invoices", label: "Invoices", icon: FileText },
  { href: "/portal/client/support", label: "Support", icon: HeadphonesIcon },
  { href: "/portal/client/documents", label: "Documents", icon: FileText },
  { href: "/portal/client/messages", label: "Messages", icon: MessageSquare },
];

const innovatorNav: NavItem[] = [
  { href: "/portal/innovation", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/innovation/submit", label: "Submit Idea", icon: Lightbulb },
  { href: "/portal/innovation/tracking", label: "Track Progress", icon: FolderKanban },
  { href: "/portal/innovation/documents", label: "Documents", icon: FileText },
  { href: "/portal/innovation/agreements", label: "Agreements", icon: FileText },
];

export function PortalSidebar({ type }: { type: "client" | "innovation" }) {
  const pathname = usePathname();
  const nav = type === "client" ? clientNav : innovatorNav;
  const title = type === "client" ? "Client Portal" : "Innovation Portal";

  return (
    <aside className="w-64 shrink-0 border-r border-gold/20 bg-deep-blue/30 min-h-screen p-4">
      <Logo size="xs" className="mb-2 px-1" />
      <p className="text-xs font-semibold text-gold mb-1 px-3">{company.name}</p>
      <h2 className="text-sm font-bold mb-6 px-3 text-gold">{title}</h2>

      <nav className="space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              pathname === item.href
                ? "bg-gold/20 text-gold"
                : "text-muted-foreground hover:bg-gold/10 hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          window.location.href = "/login";
        }}
        className="mt-8 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/10 hover:text-red-400 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </aside>
  );
}
