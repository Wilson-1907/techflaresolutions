import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate } from "@/lib/utils";
import { serverBackendFetch } from "@/lib/backend-fetch";
import { OFFICIAL_BLOGS, mergeOfficialBlogs } from "@/data/official-content";

export const metadata: Metadata = {
  title: "Company Blog",
  description: "Official articles and insights published by TechFlare Solutions.",
};

export const dynamic = "force-dynamic";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt?: string;
  tags?: string;
  author: { firstName: string; lastName: string; role: string; company?: string | null };
};

async function loadPosts(): Promise<BlogPost[]> {
  try {
    const res = await serverBackendFetch("/api/blogs?limit=50");
    if (!res.ok) return OFFICIAL_BLOGS;
    const data = await res.json();
    const remote = (data.posts ?? []) as BlogPost[];
    if (remote.length === 0) return OFFICIAL_BLOGS;
    return mergeOfficialBlogs(remote);
  } catch {
    return OFFICIAL_BLOGS;
  }
}

export default async function BlogPage() {
  const posts = await loadPosts();

  return (
    <>
      <PageHeader
        title="Company Blog"
        subtitle="Official articles from TechFlare Solutions — not your private workspace"
        badge="Blog"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="mb-8 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            This is the public company blog. To submit ideas, pay invoices, or track projects, sign in to your{" "}
            <Link href="/login" className="text-gold hover:underline">
              private workspace
            </Link>
            . To share a client story, use Testimonials inside your workspace after sign-in.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <GlassCard className="h-full transition-all group-hover:border-gold/40">
                  {post.tags && (
                    <span className="mb-2 inline-block text-xs uppercase tracking-wider text-life-green">
                      {post.tags.split(",")[0]}
                    </span>
                  )}
                  <h2 className="mb-2 text-xl font-bold group-hover:text-gold">{post.title}</h2>
                  <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {post.author.firstName} {post.author.lastName}
                      {post.author.company ? (
                        <span className="ml-1 text-gold/70">· {post.author.company}</span>
                      ) : (
                        <span className="ml-1 capitalize text-gold/70">({post.author.role.toLowerCase()})</span>
                      )}
                    </span>
                    {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
