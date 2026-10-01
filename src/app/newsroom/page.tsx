import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { newsCategoryIcons, newsCategoryLabels } from "@/lib/news";

export const metadata: Metadata = {
  title: "Newsroom",
  description: "Latest news, announcements, awards, and press releases from TechFlare Solutions.",
};

export const dynamic = "force-dynamic";

export default async function NewsroomPage() {
  const articles = await prisma.newsArticle.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="Newsroom"
        subtitle="Company news, announcements, awards, and achievements"
        badge="News"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {articles.length === 0 ? (
            <GlassCard>
              <p className="text-muted-foreground text-center py-8">
                No news published yet. Check back soon for updates from TechFlare Solutions.
              </p>
            </GlassCard>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((item, i) => {
                const Icon = newsCategoryIcons[item.category] || newsCategoryIcons.announcement;
                return (
                  <Link key={item.id} href={`/newsroom/${item.slug}`} className="block h-full">
                    <GlassCard delay={i * 0.1} className="h-full hover:border-gold/40 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-gold/20 p-3 shrink-0">
                          <Icon className="h-6 w-6 text-gold" />
                        </div>
                        <div>
                          <span className="text-xs text-gold font-semibold uppercase">
                            {newsCategoryLabels[item.category] || item.category}
                          </span>
                          <h2 className="text-lg font-bold mt-1">{item.title}</h2>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{item.excerpt}</p>
                          <span className="text-xs text-muted-foreground mt-3 block">
                            {formatDate(item.publishedAt)}
                            {item.authorName ? ` · ${item.authorName}` : ""}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
