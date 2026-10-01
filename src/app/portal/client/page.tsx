"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthGate";
import { company } from "@/data/site";
import { FolderKanban, FileText, MessageSquare, Award, Users } from "lucide-react";

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome{user ? `, ${user.firstName}` : ""}. Track projects, earn points, and manage your TechFlare Solutions relationship.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FolderKanban, label: "Active Projects", value: "3" },
          { icon: FileText, label: "Pending Invoices", value: "1" },
          { icon: MessageSquare, label: "Unread Messages", value: "5" },
          { icon: Award, label: "Reward Points", value: user?.points?.toLocaleString() ?? "0" },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <stat.icon className="h-6 w-6 text-gold mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mb-8 border-gold/20">
        <h2 className="text-lg font-bold mb-2">TechFlare Solutions Points</h2>
        <p className="text-sm text-muted-foreground">{company.pointsDescription}</p>
        {!user?.communityMember && (
          <div className="mt-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-life-green" />
            <p className="text-sm">Join our <Button href="/community" variant="ghost" size="sm" className="inline p-0 h-auto">WhatsApp community</Button> separately for careers and group activities.</p>
          </div>
        )}
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="text-lg font-bold mb-4">Recent Projects</h2>
          <div className="space-y-3">
            {[
              { name: "E-Learning Platform", progress: 85, status: "In Progress" },
              { name: "Mobile Banking App", progress: 45, status: "In Progress" },
              { name: "Data Analytics Dashboard", progress: 100, status: "Completed" },
            ].map((project) => (
              <div key={project.name} className="rounded-xl bg-white/5 p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-xs text-gold">{project.status}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gold" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3 text-sm">
            {[
              "Milestone 'API Integration' completed",
              "Invoice #INV-2026-042 issued",
              "New message from project team",
              "Document 'Sprint Report Q2' uploaded",
            ].map((activity) => (
              <div key={activity} className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-gold" />
                {activity}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
