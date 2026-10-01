"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, LayoutTemplate } from "lucide-react";
import {
  portfolioProjects,
  modernTemplates,
  company,
  showcaseConsentNote,
} from "@/data/site";
import { Button } from "@/components/ui/Button";

export function PortfolioShowcase() {
  const delivered = portfolioProjects.filter((p) => p.kind === "delivered");

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-80 pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-gold text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Projects delivered
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display">
              Real work. Modern proof.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {company.name} designs and ships digital platforms — from school websites to innovation
              portals. Featured live: St Gabriel Mission Schools at{" "}
              <span className="text-gold">stgabrielsmissionschools.sc.ke</span>.
            </p>
          </div>
          <Button href="/work" variant="outline" size="sm">
            View all work
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-14 flex gap-3 rounded-2xl border border-gold/25 bg-gold/5 px-4 py-3 sm:px-5">
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <p className="text-sm text-muted-foreground leading-relaxed">{showcaseConsentNote}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {delivered.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-gold/20 bg-deep-blue/50"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-gold/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-black">
                    Delivered
                  </span>
                  <span className="rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white">
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-gold mb-2">{project.category}</p>
                <h3 className="text-xl font-bold font-display mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{project.summary}</p>
                {project.showcaseConsent && (
                  <p className="mb-4 text-xs text-gold/90 leading-relaxed">
                    Client accepted TechFlare Solutions showcasing this project.
                  </p>
                )}
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
                      target={project.domain.startsWith("http") ? "_blank" : undefined}
                      rel={project.domain.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {project.domain.startsWith("http") ? "Visit site" : "Open product"}{" "}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-gold" />
              <h3 className="text-xl font-bold font-display">Modern templates — evidence of what we can do</h3>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6 max-w-3xl leading-relaxed">
            These templates are capability evidence — living examples of the modern digital products,
            portals, and launch systems TechFlare Solutions can brand and deliver for your organization.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{tpl.description}</p>
                  <p className="text-xs text-gold mb-3 leading-relaxed">{tpl.evidence}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tpl.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded border border-white/10 px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
