import { notFound } from "next/navigation";
import {
  PortalSectionPage,
  PortalPlaceholderList,
} from "@/components/portal/PortalSectionPage";

const sections: Record<
  string,
  { title: string; description: string; items?: { title: string; subtitle?: string; badge?: string }[] }
> = {
  projects: {
    title: "Projects",
    description: "Track all your active and completed TechFlare Solutions projects.",
    items: [
      { title: "E-Learning Platform", subtitle: "72% complete · In Progress", badge: "Active" },
      { title: "Mobile Banking App", subtitle: "Planning phase", badge: "Planning" },
      { title: "Data Analytics Dashboard", subtitle: "Delivered March 2026", badge: "Completed" },
    ],
  },
  invoices: {
    title: "Invoices",
    description: "View and download invoices for your TechFlare Solutions engagements.",
    items: [
      { title: "INV-2026-042", subtitle: "KES 150,000 · Due July 2026", badge: "Pending" },
      { title: "INV-2026-001", subtitle: "KES 250,000 · Paid", badge: "Paid" },
    ],
  },
  support: {
    title: "Support",
    description: "Open and track support tickets with the TechFlare Solutions team.",
    items: [
      { title: "API integration question", subtitle: "Open · Medium priority", badge: "Open" },
      { title: "Portal access setup", subtitle: "Resolved", badge: "Closed" },
    ],
  },
  documents: {
    title: "Documents",
    description: "Access project documents, reports, and deliverables.",
    items: [
      { title: "Sprint Report Q2.pdf", subtitle: "Uploaded May 2026", badge: "Report" },
      { title: "Project Scope v2.docx", subtitle: "Uploaded April 2026", badge: "Scope" },
    ],
  },
  messages: {
    title: "Messages",
    description: "Communicate with your TechFlare Solutions project team.",
    items: [
      { title: "Project team", subtitle: "Milestone review scheduled", badge: "Unread" },
      { title: "Accounts", subtitle: "Invoice reminder", badge: "Read" },
    ],
  },
};

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default async function ClientSectionPage({ params }: Props) {
  const { section } = await params;
  const config = sections[section];
  if (!config) notFound();

  return (
    <PortalSectionPage title={config.title} description={config.description}>
      <PortalPlaceholderList items={config.items ?? []} />
    </PortalSectionPage>
  );
}
