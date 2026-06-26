"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, AlertTriangle, CheckCircle2, Info } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  linkLabel?: string | null;
};

const icons = {
  info: Info,
  news: Megaphone,
  alert: AlertTriangle,
  success: CheckCircle2,
};

const styles = {
  info: "border-sky-500/30 bg-sky-500/10",
  news: "border-gold/30 bg-gold/10",
  alert: "border-orange-500/30 bg-orange-500/10",
  success: "border-life-green/30 bg-life-green/10",
};

/** Admin site notifications — shown in Company News / newsroom only, not site-wide. */
export function SiteAnnouncementsList({ compact = false }: { compact?: boolean }) {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((d) => setItems(d.announcements ?? []))
      .catch(() => setItems([]));
  }, []);

  if (!items.length) return null;

  return (
    <div className={compact ? "mb-8 space-y-3" : "mb-10 space-y-4"}>
      {items.map((item) => {
        const Icon = icons[item.type as keyof typeof icons] ?? Info;
        const style = styles[item.type as keyof typeof styles] ?? styles.info;
        return (
          <article
            key={item.id}
            className={`rounded-2xl border p-5 ${style}`}
          >
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
