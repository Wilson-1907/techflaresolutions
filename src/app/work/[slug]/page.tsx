import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { portfolioProjects } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolioProjects.find((p) => p.slug === slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} | TechFlare Solutions`,
      description: project.summary,
      url: `/work/${project.slug}`,
    },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = portfolioProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <PageHeader title={project.title} subtitle={project.category} badge="Case Study" />
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-4 lg:px-8 space-y-10">
          <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden border border-gold/20">
            <Image src={project.image} alt={project.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground text-lg leading-relaxed">{project.summary}</p>
            <p className="text-sm text-muted-foreground">
              Client: <span className="text-foreground">{project.client}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-gold/20 bg-gold/5 px-3 py-1 text-xs text-gold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {project.slug === "st-gabriel-mission-schools" && (
            <div className="rounded-3xl border border-gold/20 bg-deep-blue/40 p-8 space-y-4">
              <h2 className="text-2xl font-bold font-display">About this build</h2>
              <p className="text-muted-foreground leading-relaxed">
                TechFlare Solutions designed and engineered a modern institutional website for St Gabriel Mission
                Schools. The platform presents academics, campus life, and admissions in a fast, mobile-first
                experience — ready for the official school domain.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Live domain:{" "}
                <strong className="text-gold">stgabrielsmissionschools.sc.ke</strong>
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {project.domain && (
              <Button href={project.domain} size="lg">
                Visit {project.title}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            )}
            <Button href="/contact" variant="outline" size="lg">
              Start a similar project
            </Button>
            <Button href="/work" variant="ghost" size="lg">
              Back to work
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
