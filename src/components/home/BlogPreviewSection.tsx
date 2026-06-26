"use client";



import { useEffect, useState } from "react";

import Link from "next/link";

import { motion } from "framer-motion";

import { ArrowRight } from "lucide-react";

import { BlogWriteButton } from "@/components/blog/BlogWriteButton";

import { apiUrl } from "@/lib/api-base";

import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/Button";

import { GlassCard } from "@/components/ui/GlassCard";

import { OFFICIAL_BLOGS, mergeOfficialBlogs } from "@/data/official-content";



type BlogPost = {

  id: string;

  slug: string;

  title: string;

  excerpt: string;

  publishedAt?: string | null;

  tags?: string | null;

  author: { firstName: string; lastName: string; role: string; company?: string | null };

};



export function BlogPreviewSection() {

  const [posts, setPosts] = useState<BlogPost[]>(OFFICIAL_BLOGS.slice(0, 3));



  useEffect(() => {

    fetch(apiUrl("/api/blogs?limit=3"))

      .then((r) => (r.ok ? r.json() : { posts: [] }))

      .then((d) => {

        const remote = (d.posts ?? []) as BlogPost[];

        const merged = mergeOfficialBlogs(remote).slice(0, 3);

        setPosts(merged);

      })

      .catch(() => setPosts(OFFICIAL_BLOGS.slice(0, 3)));

  }, []);



  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-4 lg:px-8">

        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">

          <div>

            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-gold">

              TechFlare Insights

            </span>

            <h2 className="text-3xl font-bold sm:text-4xl">

              Industry Perspectives & <span className="text-gold">Company Updates</span>

            </h2>

            <p className="mt-3 max-w-xl text-muted-foreground">

              Official thought leadership from TechFlare Solutions — plus reviewed stories from clients and innovators.

            </p>

          </div>

          <div className="flex gap-3">

            <BlogWriteButton variant="outline" size="sm" />

            <Button href="/blog" size="sm">

              View All <ArrowRight className="h-4 w-4" />

            </Button>

          </div>

        </div>



        <div className="grid gap-6 md:grid-cols-3">

          {posts.map((post, i) => (

            <motion.div

              key={post.id}

              initial={{ opacity: 0, y: 30 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}

              transition={{ delay: i * 0.1 }}

            >

              <Link href={`/blog/${post.slug}`} className="group block h-full">

                <GlassCard className="h-full transition-all group-hover:border-gold/40 group-hover:shadow-lg group-hover:shadow-gold/5">

                  {post.tags && (

                    <span className="mb-3 inline-block text-xs font-medium uppercase tracking-wider text-life-green">

                      {post.tags.split(",")[0]}

                    </span>

                  )}

                  <h3 className="mb-2 text-lg font-bold group-hover:text-gold transition-colors">

                    {post.title}

                  </h3>

                  <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>

                  <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">

                    <span>

                      {post.author.firstName} {post.author.lastName}

                      {post.author.company ? ` · ${post.author.company}` : ""}

                    </span>

                    {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}

                  </div>

                </GlassCard>

              </Link>

            </motion.div>

          ))}

        </div>

      </div>

    </section>

  );

}

