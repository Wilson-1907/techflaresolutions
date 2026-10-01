"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, LayoutTemplate } from "lucide-react";
import { portfolioProjects, modernTemplates, company } from "@/data/site";
import { Button } from "@/components/ui/Button";

export function PortfolioShowcase() {
  const featured = portfolioProjects.filter((p) => p.featured);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-80 pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-gold text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Work & digital products
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display">
              Built for the modern web
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {company.name} designs and ships digital platforms — from school websites to innovation portals.
              Featured: St Gabriel Mission Schools at{" "}
              <span className="text-gold">stgabrielsmissionschools.sc.ke</span>.
            </p>
          </div>
          <Button href="/work" variant="outline" size="sm">
            View all work
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          {featured.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-gold/20 bg-deep-blue/50"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs uppercase tracking-wider text-gold mb-2">{project.category}</p>
                <h3 className="text-2xl font-bold font-display mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.summary}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
                  >
                    Case study <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  {project.domain && (
                    <a
                      href={project.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Visit site <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <LayoutTemplate className="h-5 w-5 text-gold" />
            <h3 className="text-xl font-bold font-display">Modern templates we deliver</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modernTemplates.map((tpl, i) => (
              <motion.div
                key={tpl.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={tpl.href}
                  className="block h-full rounded-2xl border border-gold/15 bg-deep-blue/40 p-5 hover:border-gold/40 hover:bg-gold/5 transition-colors"
                >
                  <h4 className="font-semibold mb-2">{tpl.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tpl.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
