import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate } from "@/lib/utils";
import { newsCategoryIcons, newsCategoryLabels } from "@/lib/news";

export type NewsArticleCardData = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  authorName?: string;
  publishedAt?: string;
};

export function NewsArticleCard({
  article,
  index = 0,
  asLink = true,
}: {
  article: NewsArticleCardData;
  index?: number;
  asLink?: boolean;
}) {
  const Icon = newsCategoryIcons[article.category] || newsCategoryIcons.announcement;

  const inner = (
    <GlassCard delay={index * 0.05} className="h-full hover:border-gold/40 transition-colors">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-gold/20 p-3 shrink-0">
          <Icon className="h-6 w-6 text-gold" />
        </div>
        <div className="min-w-0">
          <span className="text-xs text-gold font-semibold uppercase">
            {newsCategoryLabels[article.category] || article.category}
          </span>
          <h2 className="text-lg font-bold mt-1">{article.title}</h2>
          {article.excerpt && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{article.excerpt}</p>
          )}
          <span className="text-xs text-muted-foreground mt-3 block">
            {article.publishedAt ? formatDate(article.publishedAt) : ""}
            {article.authorName ? ` · ${article.authorName}` : ""}
          </span>
        </div>
      </div>
    </GlassCard>
  );

  if (!asLink) return inner;

  return (
    <Link href={`/newsroom/${article.slug}`} className="block h-full">
      {inner}
    </Link>
  );
}
