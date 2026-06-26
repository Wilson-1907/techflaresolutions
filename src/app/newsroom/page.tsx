import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { NewsArticleCard } from "@/components/news/NewsArticleCard";
import { SiteAnnouncementsList } from "@/components/layout/SiteAnnouncementsList";
import { serverBackendFetch } from "@/lib/backend-fetch";
import { OFFICIAL_NEWS, mergeOfficialNews } from "@/data/official-content";

export const metadata: Metadata = {
  title: "Newsroom",
  description: "Latest news, announcements, awards, and press releases from TechFlare Solutions.",
};

export const dynamic = "force-dynamic";

type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  authorName?: string;
  publishedAt?: string;
};

async function loadArticles(): Promise<NewsArticle[]> {
  try {
    const res = await serverBackendFetch("/api/news");
    if (!res.ok) return OFFICIAL_NEWS;
    const data = await res.json();
    const remote = (data.articles ?? []) as NewsArticle[];
    if (remote.length === 0) return OFFICIAL_NEWS;
    return mergeOfficialNews(remote);
  } catch {
    return OFFICIAL_NEWS;
  }
}

export default async function NewsroomPage() {
  const articles = await loadArticles();

  return (
    <>
      <PageHeader
        title="Newsroom"
        subtitle="Official company news, announcements, and press releases"
        badge="News"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SiteAnnouncementsList />
          {articles.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">No published articles yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((item, i) => (
                <NewsArticleCard key={item.id} article={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
