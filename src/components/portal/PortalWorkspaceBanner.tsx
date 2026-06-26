import Link from "next/link";
import { Globe, Lock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PORTAL_LABELS, SITE_LABELS } from "@/lib/site-vs-portal";

export function PortalWorkspaceBanner() {
  return (
    <GlassCard className="mb-6 border-life-green/25 bg-life-green/5 py-3 px-4">
      <div className="flex flex-wrap items-start gap-3 text-sm">
        <Lock className="h-5 w-5 text-life-green shrink-0 mt-0.5" aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground leading-snug">{PORTAL_LABELS.workspaceHint}</p>
          <p className="text-xs text-muted-foreground mt-1">{PORTAL_LABELS.blogHint}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gold/30 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10 shrink-0"
        >
          <Globe className="h-3.5 w-3.5" />
          {SITE_LABELS.publicSite}
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
        >
          {SITE_LABELS.companyBlog}
        </Link>
      </div>
    </GlassCard>
  );
}
