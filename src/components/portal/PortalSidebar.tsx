"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Lightbulb,
  HeadphonesIcon,
  ShoppingBag,
  Wrench,
  Star,
  Send,
  Bot,
  Quote,
  Award,
  History,
  Receipt,
  Bell,
  CheckCircle2,
  PlayCircle,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const clientNav: NavGroup[] = [
  {
    title: "Your work",
    items: [
      { href: "/portal/client", label: "Overview", icon: LayoutDashboard },
      { href: "/portal/client/submit", label: "New request", icon: Send },
      { href: "/portal/client/projects", label: "Projects", icon: FolderKanban },
      { href: "/portal/client/services", label: "Services ordered", icon: Wrench },
      { href: "/portal/client/documents", label: "Deliverables", icon: FileText },
      { href: "/portal/client/revisions", label: "Revisions", icon: PenLine },
    ],
  },
  {
    title: "Billing",
    items: [
      { href: "/portal/client/invoices", label: "Invoices", icon: Receipt },
      { href: "/portal/client/payments", label: "Payment history", icon: History },
      { href: "/portal/client/orders", label: "Purchases", icon: ShoppingBag },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/portal/client/points", label: "Loyalty points", icon: Award },
    ],
  },
  {
    title: "Feedback & help",
    items: [
      { href: "/portal/client/support", label: "Support", icon: HeadphonesIcon },
      { href: "/portal/client/ratings", label: "Rate our services", icon: Star },
      { href: "/portal/client/testimonials", label: "Testimonials", icon: Quote },
      { href: "/portal/client/messages", label: "Notifications", icon: MessageSquare },
    ],
  },
];

const innovatorNav: NavGroup[] = [
  {
    title: "Your innovation",
    items: [
      { href: "/portal/innovation", label: "Overview", icon: LayoutDashboard },
      { href: "/portal/innovation/submit", label: "Submit to TechFlare", icon: Lightbulb },
      { href: "/portal/innovation/tracking", label: "Track submissions", icon: FolderKanban },
      { href: "/portal/innovation/documents", label: "Documents", icon: FileText },
      { href: "/portal/innovation/revisions", label: "Revisions", icon: PenLine },
      { href: "/portal/innovation/ai", label: "AI idea coach (paid)", icon: Bot },
      { href: "/portal/innovation/agreements", label: "Agreements", icon: FileText },
    ],
  },
  {
    title: "Billing",
    items: [
      { href: "/portal/innovation/invoices", label: "Invoices", icon: Receipt },
      { href: "/portal/innovation/payments", label: "Payment history", icon: History },
    ],
  },
  {
    title: "Feedback & help",
    items: [
      { href: "/portal/innovation/support", label: "Support", icon: HeadphonesIcon },
      { href: "/portal/innovation/ratings", label: "Rate our services", icon: Star },
      { href: "/portal/innovation/messages", label: "Notifications", icon: MessageSquare },
    ],
  },
  {
    title: "Community",
    items: [
      { href: "/portal/innovation/testimonials", label: "Share testimonial", icon: Quote },
    ],
  },
];

const employeeNav: NavGroup[] = [
  {
    title: "Work",
    items: [
      { href: "/portal/employee", label: "Overview", icon: LayoutDashboard },
      { href: "/portal/employee/projects", label: "All projects", icon: FolderKanban },
      { href: "/portal/employee/active", label: "Active delivery", icon: PlayCircle },
      { href: "/portal/employee/completed", label: "Completed", icon: CheckCircle2 },
    ],
  },
  {
    title: "Billing",
    items: [
      { href: "/portal/employee/invoices", label: "Invoices", icon: Receipt },
      { href: "/portal/employee/payments", label: "Client deposits", icon: History },
    ],
  },
  {
    title: "Communication",
    items: [
      { href: "/portal/employee/notifications", label: "Notifications", icon: Bell },
      { href: "/portal/employee/messages", label: "Company messages", icon: MessageSquare },
    ],
  },
];

export function PortalSidebar({
  type,
  open,
  onNavigate,
}: {
  type: "client" | "innovation" | "employee";
  open: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const groups = type === "client" ? clientNav : type === "employee" ? employeeNav : innovatorNav;

  function isNavActive(href: string) {
    if (
      href === "/portal/employee" ||
      href === "/portal/client" ||
      href === "/portal/innovation"
    ) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const navContent = (
    <nav className="space-y-5 p-4" aria-label="Workspace menu">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.title}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors min-h-[44px]",
                  isNavActive(item.href)
                    ? "bg-gold/20 text-gold font-medium"
                    : "text-muted-foreground hover:bg-gold/10 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close menu"
          onClick={onNavigate}
        />
      )}

      <aside
        id="portal-sidebar"
        className={cn(
          "fixed top-14 bottom-0 left-0 z-40 w-[min(280px,85vw)] border-r border-gold/20 bg-deep-blue/98 backdrop-blur-xl overflow-y-auto transition-transform duration-200 lg:static lg:z-auto lg:w-64 lg:shrink-0 lg:translate-x-0 lg:bg-deep-blue/30",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
