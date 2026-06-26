import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { TrendingUp, FileBarChart, DollarSign, Users } from "lucide-react";
import { buildEmailComposeLink } from "@/lib/mailto";

export const metadata: Metadata = {
  title: "Investor Relations",
  description: "Financial reports, growth metrics, and investment opportunities at TechFlare Solutions.",
};

export default function InvestorRelationsPage() {
  return (
    <>
      <PageHeader
        title="Investor Relations"
        subtitle="Building long-term value through innovation and growth"
        badge="Investors"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: "YoY Revenue Growth", value: "145%" },
              { icon: Users, label: "Active Clients", value: "200+" },
              { icon: DollarSign, label: "ARR", value: "$12M" },
              { icon: FileBarChart, label: "Projects Delivered", value: "500+" },
            ].map((metric) => (
              <GlassCard key={metric.label} className="text-center">
                <metric.icon className="h-8 w-8 text-gold mx-auto mb-2" />
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </GlassCard>
            ))}
          </div>

          <GlassCard>
            <h2 className="text-2xl font-bold mb-4">Investment Opportunities</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              TechFlare Solutions is actively seeking strategic investors who share our vision of transforming
              how ideas become world-class technology solutions. We offer participation in our Innovation Fund,
              which co-invests in validated ideas from our Innovation Hub.
            </p>
            <Button href={buildEmailComposeLink({ type: "investor" })}>Email us — Investor Relations</Button>
          </GlassCard>

          <div>
            <h2 className="text-2xl font-bold mb-6">Financial Reports</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {["Annual Report 2025", "Q1 2026 Earnings", "Innovation Fund Prospectus"].map((report) => (
                <GlassCard key={report}>
                  <h3 className="font-semibold">{report}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Available upon request</p>
                  <Button
                    href={buildEmailComposeLink({ type: "general", label: `Report request: ${report}` })}
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                  >
                    Request via email →
                  </Button>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
