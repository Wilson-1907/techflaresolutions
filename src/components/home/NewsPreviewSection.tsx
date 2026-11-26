"use client";

import { ArrowRight, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NewsArticleCard } from "@/components/news/NewsArticleCard";
import { SiteAnnouncementsList } from "@/components/layout/SiteAnnouncementsList";
import { OFFICIAL_NEWS } from "@/data/official-content";

export function NewsPreviewSection() {
  return (
    <section className="py-24 border-y border-white/8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
              <Newspaper className="h-4 w-4" /> Notices
            </span>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl tracking-tight">
              Official site notices
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Only two public notices: we will open soon, and we are open.
            </p>
          </div>
          <Button href="/newsroom" size="sm" variant="outline">
            Newsroom <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <SiteAnnouncementsList compact />

        <div className="grid gap-6 md:grid-cols-2">
          {OFFICIAL_NEWS.map((article, i) => (
            <NewsArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
