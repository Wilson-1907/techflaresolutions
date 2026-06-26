"use client";

import { Building2, Lightbulb } from "lucide-react";

const accountTypes = [
  {
    value: "CLIENT",
    title: "Client",
    subtitle: "I want TechFlare to build or deliver services for me",
    icon: Building2,
    bestFor: "Businesses, NGOs, schools, and professionals hiring TechFlare",
    portal: "Client Portal",
    features: [
      "Track active projects and delivery milestones",
      "View invoices, receipts, and payment history",
      "Order products and request support tickets",
      "Rate completed services and manage documents",
    ],
  },
  {
    value: "INNOVATOR",
    title: "Innovator",
    subtitle: "I have an idea or innovation I want to develop with TechFlare",
    icon: Lightbulb,
    bestFor: "Founders, researchers, students, and creators with ideas to pitch",
    portal: "Innovator workspace",
    features: [
      "Submit and track ideas through the innovation pipeline",
      "Follow review stages and partnership agreements",
      "Earn community points and share testimonials",
      "Access innovation documents and progress updates",
    ],
  },
] as const;

export function AccountTypePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (role: "CLIENT" | "INNOVATOR") => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">Choose your account type</p>
        <p className="text-xs text-muted-foreground mt-1">
          Pick the portal that matches what you need. This cannot be changed later without contacting support.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {accountTypes.map((type) => {
          const selected = value === type.value;
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                selected
                  ? "border-gold bg-gold/10 ring-2 ring-gold/40"
                  : "border-gold/20 bg-deep-blue/30 hover:border-gold/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-xl p-2 ${selected ? "bg-gold/20 text-gold" : "bg-white/5 text-muted-foreground"}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gold">{type.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{type.subtitle}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                <span className="text-foreground font-medium">Best for:</span> {type.bestFor}
              </p>
              <p className="text-xs text-gold mt-2 font-medium">{type.portal}</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {type.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
