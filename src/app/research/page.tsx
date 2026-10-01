import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { FileText, BookOpen, BarChart3, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Research Center",
  description: "White papers, case studies, industry reports, and innovation research from TechFlare Solutions.",
};

const publications = [
  {
    type: "white_paper",
    title: "The Future of AI in Enterprise Decision Making",
    excerpt: "How artificial intelligence is transforming strategic business decisions across industries.",
    author: "Dr. Amara Okafor",
    date: "March 2026",
    icon: FileText,
  },
  {
    type: "case_study",
    title: "Blockchain Voting: A Case Study in Electoral Integrity",
    excerpt: "How TechFlare Solutions deployed a tamper-proof voting system for a national election.",
    author: "James Chen",
    date: "February 2026",
    icon: BookOpen,
  },
  {
    type: "industry_report",
    title: "Smart Agriculture Market Report 2026",
    excerpt: "Comprehensive analysis of IoT adoption and precision farming trends globally.",
    author: "Sarah Mitchell",
    date: "January 2026",
    icon: BarChart3,
  },
  {
    type: "innovation_report",
    title: "Innovation Pipeline: Q1 2026 Review",
    excerpt: "Insights from 200+ idea submissions and their journey through our validation framework.",
    author: "David Okonkwo",
    date: "April 2026",
    icon: Lightbulb,
  },
];

const typeLabels: Record<string, string> = {
  white_paper: "White Paper",
  case_study: "Case Study",
  industry_report: "Industry Report",
  innovation_report: "Innovation Report",
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        title="Research Center"
        subtitle="Building authority through rigorous research and thought leadership"
        badge="Research"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {publications.map((pub, i) => (
              <GlassCard key={pub.title} delay={i * 0.1}>
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gold/20 p-3">
                    <pub.icon className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <span className="text-xs text-gold font-semibold uppercase">
                      {typeLabels[pub.type]}
                    </span>
                    <h2 className="text-lg font-bold mt-1">{pub.title}</h2>
                    <p className="text-sm text-muted-foreground mt-2">{pub.excerpt}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{pub.author} · {pub.date}</span>
                      <Button variant="ghost" size="sm">Read More →</Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
