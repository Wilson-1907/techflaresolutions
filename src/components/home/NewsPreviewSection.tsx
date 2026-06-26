"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Newspaper } from "lucide-react";
import { apiUrl } from "@/lib/api-base";
import { Button } from "@/components/ui/Button";
import { NewsArticleCard, type NewsArticleCardData } from "@/components/news/NewsArticleCard";
import { SiteAnnouncementsList } from "@/components/layout/SiteAnnouncementsList";
import { OFFICIAL_NEWS, mergeOfficialNews } from "@/data/official-content";

export function NewsPreviewSection() {
  const [articles, setArticles] = useState<NewsArticleCardData[]>(OFFICIAL_NEWS.slice(0, 3));

  useEffect(() => {
    fetch(apiUrl("/api/news?limit=3"))
      .then((r) => (r.ok ? r.json() : { articles: [] }))
      .then((d) => {
        const remote = (d.articles ?? []) as NewsArticleCardData[];
        setArticles(mergeOfficialNews(remote).slice(0, 3));
      })
      .catch(() => setArticles(OFFICIAL_NEWS.slice(0, 3)));
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="py-24 bg-deep-blue/20 border-y border-gold/10">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold">
              <Newspaper className="h-4 w-4" /> Company News
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Latest from the <span className="text-gold">Newsroom</span>
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Official announcements, awards, and updates from TechFlare Solutions.
            </p>
          </div>
          <Button href="/newsroom" size="sm">
            Newsroom <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <SiteAnnouncementsList compact />

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article, i) => (
            <NewsArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
