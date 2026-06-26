import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate } from "@/lib/utils";
import { newsCategoryLabels } from "@/lib/news";
import { serverBackendFetch } from "@/lib/backend-fetch";
import { getOfficialNewsBySlug } from "@/data/official-content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

type Article = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  authorName?: string;
  publishedAt?: string;
};

async function loadArticle(slug: string): Promise<Article | null> {
  const official = getOfficialNewsBySlug(slug);
  if (official) return official;

  try {
    const res = await serverBackendFetch(`/api/news/${slug}`);
    if (!res.ok) return null;
    const { article } = await res.json();
    return article ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return { title: "News" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) notFound();

  return (
    <>
      <PageHeader
        title={article.title}
        subtitle={newsCategoryLabels[article.category] || article.category}
        badge="Newsroom"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Link
            href="/newsroom"
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Newsroom
          </Link>

          <GlassCard>
            <p className="text-sm text-muted-foreground mb-6">
              {article.publishedAt ? formatDate(article.publishedAt) : ""}
              {article.authorName ? ` · ${article.authorName}` : ""}
            </p>
            <p className="text-lg text-gold/90 mb-8">{article.excerpt}</p>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {article.content}
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
