import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { portfolioProjects, modernTemplates, showcaseConsentNote } from "@/data/site";
import { ArrowUpRight, BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Work & Digital Templates",
  description:
    "TechFlare Solutions projects delivered — including St Gabriel Mission Schools — plus modern templates as evidence of what we can build.",
  keywords: [
    "TechFlare Solutions portfolio",
    "St Gabriel Mission Schools",
    "stgabrielsmissionschools.sc.ke",
    "school website Kenya",
    "digital templates",
    "projects delivered",
  ],
  alternates: { canonical: "/work" },
  openGraph: {
    title: "TechFlare Solutions Work",
    description: "Projects delivered with client showcase permission, plus modern capability templates.",
    url: "/work",
  },
  robots: { index: true, follow: true },
};

export default function WorkPage() {
  const delivered = portfolioProjects.filter((p) => p.kind === "delivered");

  return (
    <>
      <PageHeader
        title="Projects Delivered"
        subtitle="Client work shown with permission — plus modern templates as evidence of what we can do"
        badge="Portfolio"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-16">
          <div className="flex gap-3 rounded-2xl border border-gold/25 bg-gold/5 px-4 py-4 sm:px-6">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p className="text-sm text-muted-foreground leading-relaxed">{showcaseConsentNote}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display mb-6">Delivered examples</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {delivered.map((project) => (
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
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="rounded-md bg-gold/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-black">
                        Delivered
                      </span>
                      <span className="rounded-md bg-black/55 px-2.5 py-1 text-[11px] text-white">
                        {project.year}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-gold uppercase tracking-wider mb-2">{project.category}</p>
                    <h2 className="text-xl font-bold font-display mb-2">{project.title}</h2>
                    <p className="text-sm text-muted-foreground mb-3">{project.summary}</p>
                    {project.showcaseConsent && (
                      <p className="mb-4 text-xs text-gold/90 leading-relaxed">
                        Client accepted TechFlare Solutions showcasing this project.
                      </p>
                    )}
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
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display mb-2">
              Modern templates — evidence of what we can do
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-3xl leading-relaxed">
              These are not empty mockups. Each template demonstrates a digital system we can customize,
              brand, and launch for your school, enterprise, or product.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {modernTemplates.map((tpl) => (
                <Link
                  key={tpl.title}
                  href={tpl.href}
                  className="rounded-2xl border border-gold/15 bg-deep-blue/30 p-6 hover:border-gold/40 transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-2">{tpl.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{tpl.description}</p>
                  <p className="text-xs text-gold mb-3">{tpl.evidence}</p>
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
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
