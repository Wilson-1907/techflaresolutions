import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Lightbulb, Clock, CheckCircle2, FileText } from "lucide-react";

const statusColors: Record<string, string> = {
  SUBMITTED: "text-yellow-400",
  RESEARCH_REVIEW: "text-blue-400",
  RISK_ASSESSMENT: "text-orange-400",
  FEASIBILITY_ANALYSIS: "text-purple-400",
  APPROVED: "text-green-400",
  REJECTED: "text-red-400",
  IN_DEVELOPMENT: "text-gold",
};

export default function InnovationDashboard() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Innovation Portal</h1>
          <p className="text-muted-foreground">Track your ideas through our validation pipeline</p>
        </div>
        <Button href="/portal/innovation/submit" className="mt-4 sm:mt-0">
          <Lightbulb className="h-4 w-4" /> Submit New Idea
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Lightbulb, label: "Total Submissions", value: "4" },
          { icon: Clock, label: "In Review", value: "2" },
          { icon: CheckCircle2, label: "Approved", value: "1" },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <stat.icon className="h-6 w-6 text-gold mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <h2 className="text-lg font-bold mb-4">Your Submissions</h2>
        <div className="space-y-4">
          {[
            { title: "AI-Powered Crop Disease Detector", status: "FEASIBILITY_ANALYSIS", date: "May 28, 2026" },
            { title: "Blockchain Supply Chain Tracker", status: "RESEARCH_REVIEW", date: "June 2, 2026" },
            { title: "Smart Campus Navigation App", status: "APPROVED", date: "April 15, 2026" },
            { title: "Telemedicine Kiosk System", status: "SUBMITTED", date: "June 8, 2026" },
          ].map((idea) => (
            <div key={idea.title} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-white/5 p-4 gap-3">
              <div>
                <h3 className="font-medium">{idea.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">Submitted {idea.date}</p>
              </div>
              <span className={`text-sm font-medium ${statusColors[idea.status]}`}>
                {idea.status.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <GlassCard>
          <FileText className="h-6 w-6 text-gold mb-3" />
          <h3 className="font-semibold">Upload Documents</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Attach research papers, prototypes, and supporting materials to your submissions.
          </p>
          <Button href="/portal/innovation/documents" variant="outline" size="sm" className="mt-4">
            Manage Documents
          </Button>
        </GlassCard>
        <GlassCard>
          <CheckCircle2 className="h-6 w-6 text-green-400 mb-3" />
          <h3 className="font-semibold">Agreements</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Review and sign partnership agreements for approved innovations.
          </p>
          <Button href="/portal/innovation/agreements" variant="outline" size="sm" className="mt-4">
            View Agreements
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
