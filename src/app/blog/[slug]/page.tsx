import { Metadata } from "next";

import Link from "next/link";

import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";

import { GlassCard } from "@/components/ui/GlassCard";

import { formatDate } from "@/lib/utils";
import { serverBackendFetch } from "@/lib/backend-fetch";
import { getOfficialBlogBySlug } from "@/data/official-content";



export const dynamic = "force-dynamic";



type Props = { params: Promise<{ slug: string }> };



type BlogPost = {

  title: string;

  excerpt: string;

  content: string;

  publishedAt?: string;

  tags?: string;

  authorRole?: string;

  author: { firstName: string; lastName: string; role: string; company?: string | null };

};



async function loadPost(slug: string): Promise<BlogPost | null> {

  const official = getOfficialBlogBySlug(slug);

  if (official) return official;



  try {

    const res = await serverBackendFetch(`/api/blogs/${slug}`);

    if (!res.ok) return null;

    const { post } = await res.json();

    return post ?? null;

  } catch {

    return null;

  }

}



export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const post = await loadPost(slug);

  if (!post) return { title: "Blog" };

  return { title: post.title, description: post.excerpt };

}



export default async function BlogArticlePage({ params }: Props) {

  const { slug } = await params;

  const post = await loadPost(slug);

  if (!post) notFound();



  return (

    <>

      <PageHeader

        title={post.title}

        subtitle={`By ${post.author.firstName} ${post.author.lastName}${post.author.company ? ` · ${post.author.company}` : ""}`}

        badge="Blog"

      />



      <section className="pb-24">

        <div className="mx-auto max-w-3xl px-4 lg:px-8">

          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-6">

            <ArrowLeft className="h-4 w-4" /> Back to Blog

          </Link>



          <GlassCard>

            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">

              <span className="capitalize rounded-full bg-gold/10 px-2 py-0.5 text-gold">

                {post.authorRole?.toLowerCase() || post.author.role.toLowerCase()}

              </span>

              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}

              {post.tags && <span>{post.tags}</span>}

            </div>

            <p className="text-lg text-gold/90 mb-8">{post.excerpt}</p>

            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-muted-foreground leading-relaxed">

              {post.content}

            </div>

          </GlassCard>

        </div>

      </section>

    </>

  );

}

