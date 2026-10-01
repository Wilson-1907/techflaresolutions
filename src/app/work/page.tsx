import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { portfolioProjects, modernTemplates } from "@/data/site";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Work & Digital Templates",
  description:
    "TechFlare Solutions portfolio — St Gabriel Mission Schools website, modern school templates, innovation portals, and enterprise digital products.",
  keywords: [
    "TechFlare Solutions portfolio",
    "St Gabriel Mission Schools",
    "stgabrielsmissionschools.sc.ke",
    "school website Kenya",
    "digital templates",
  ],
  alternates: { canonical: "/work" },
  openGraph: {
    title: "TechFlare Solutions Work",
    description: "Featured digital builds including St Gabriel Mission Schools.",
    url: "/work",
  },
  robots: { index: true, follow: true },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        title="Work & Templates"
        subtitle="Modern digital products and websites we design, build, and launch"
        badge="Portfolio"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioProjects.map((project) => (
              <article
                key={project.slug}
                className="overflow-hidden rounded-3xl border border-gold/20 bg-deep-blue/40"
              >
                <div className="relative h-48">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-6">
                  <p className="text-xs text-gold uppercase tracking-wider mb-2">{project.category}</p>
                  <h2 className="text-xl font-bold font-display mb-2">{project.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{project.summary}</p>
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
                  >
                    View details <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display mb-6">Modern templates</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {modernTemplates.map((tpl) => (
                <Link
                  key={tpl.title}
                  href={tpl.href}
                  className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-6 hover:border-gold/40 transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-2">{tpl.title}</h3>
                  <p className="text-sm text-muted-foreground">{tpl.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
