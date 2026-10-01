import { notFound } from "next/navigation";
import {
  PortalSectionPage,
  PortalPlaceholderList,
  PortalActionCard,
} from "@/components/portal/PortalSectionPage";

const sections: Record<
  string,
  { title: string; description: string; items?: { title: string; subtitle?: string; badge?: string }[] }
> = {
  submit: {
    title: "Submit Idea",
    description: "Send a new idea, invention, or business concept to the Innovation Hub.",
  },
  tracking: {
    title: "Track Progress",
    description: "Follow your submissions through research review, risk assessment, and approval.",
    items: [
      { title: "AI-Powered Crop Disease Detector", subtitle: "Feasibility Analysis", badge: "In Review" },
      { title: "Blockchain Supply Chain Tracker", subtitle: "Research Review", badge: "In Review" },
      { title: "Smart Campus Navigation App", subtitle: "Approved", badge: "Approved" },
    ],
  },
  documents: {
    title: "Documents",
    description: "Upload research papers, prototypes, and supporting files for your ideas.",
    items: [
      { title: "CropVision_prototype.zip", subtitle: "Attached to Crop Disease Detector", badge: "File" },
      { title: "Research_summary.pdf", subtitle: "Attached to Supply Chain Tracker", badge: "File" },
    ],
  },
  agreements: {
    title: "Agreements",
    description: "Review partnership and development agreements for approved innovations.",
    items: [
      { title: "Smart Campus Navigation — Partnership Draft", subtitle: "Awaiting signature", badge: "Pending" },
    ],
  },
};

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default async function InnovationSectionPage({ params }: Props) {
  const { section } = await params;
  const config = sections[section];
  if (!config) notFound();

  if (section === "submit") {
    return (
      <PortalSectionPage title={config.title} description={config.description}>
        <PortalActionCard
          title="Innovation Hub"
          description="Use the full Innovation Hub to submit ideas with detailed forms and AI-assisted guidance."
          href="/innovation-hub"
          label="Open Innovation Hub"
        />
      </PortalSectionPage>
    );
  }

  return (
    <PortalSectionPage title={config.title} description={config.description}>
      <PortalPlaceholderList items={config.items ?? []} />
    </PortalSectionPage>
  );
}
