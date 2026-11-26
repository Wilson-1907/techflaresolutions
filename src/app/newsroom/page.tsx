import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { NewsArticleCard } from "@/components/news/NewsArticleCard";
import { SiteAnnouncementsList } from "@/components/layout/SiteAnnouncementsList";
import { OFFICIAL_NEWS } from "@/data/official-content";
import { SEO_KEYWORDS } from "@/data/seo";

export const metadata: Metadata = {
  title: "Newsroom — We Will Open Soon · We Are Open",
  description:
    "TechFlare Solutions official notices: we will open soon, and we are open. Technology, research, software, AI, and automation updates from Kenya.",
  keywords: [...SEO_KEYWORDS, "newsroom", "announcements", "press"],
  alternates: { canonical: "/newsroom" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Newsroom | TechFlare Solutions",
    description: "Two official notices — opening soon and we are open.",
    url: "/newsroom",
  },
};

export default function NewsroomPage() {
  const articles = OFFICIAL_NEWS;

  return (
    <>
      <PageHeader
        title="Newsroom"
        subtitle="Two official notices from TechFlare Solutions"
        badge="News"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SiteAnnouncementsList />
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((item, i) => (
              <NewsArticleCard key={item.id} article={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
