"use client";

import Link from "next/link";
import { Megaphone, CheckCircle2 } from "lucide-react";
import { SITE_NOTICES } from "@/data/notices";

const icons = {
  news: Megaphone,
  success: CheckCircle2,
  info: Megaphone,
  alert: Megaphone,
};

const styles = {
  news: "border-gold/30 bg-gold/10",
  success: "border-life-green/30 bg-life-green/10",
  info: "border-sky-500/30 bg-sky-500/10",
  alert: "border-orange-500/30 bg-orange-500/10",
};

/** Only the two official site notices are shown. */
export function SiteAnnouncementsList({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "mb-8 space-y-3" : "mb-10 space-y-4"}>
      {SITE_NOTICES.map((item) => {
        const Icon = icons[item.type] ?? Megaphone;
        const style = styles[item.type] ?? styles.info;
        return (
          <article key={item.id} className={`rounded-2xl border p-5 ${style}`}>
            <div className="flex gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.message}</p>
                {item.link ? (
                  <Link href={item.link} className="mt-3 inline-block text-sm text-gold hover:underline">
                    {item.linkLabel || "Learn more"}
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
