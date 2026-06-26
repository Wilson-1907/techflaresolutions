import { notFound } from "next/navigation";
import { InnovatorSectionView } from "@/components/portal/InnovatorPortalViews";
import { ClientSectionView } from "@/components/portal/ClientPortalViews";
import { GlassCard } from "@/components/ui/GlassCard";

const innovatorSections = ["submit", "tracking", "ai", "testimonials", "documents", "agreements"];

const sharedBillingSections = ["invoices", "payments", "ratings", "support", "messages", "revisions"];

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return [...innovatorSections, ...sharedBillingSections].map((section) => ({ section }));
}

export default async function InnovationSectionPage({ params }: Props) {
  const { section } = await params;

  if (sharedBillingSections.includes(section)) {
    return <ClientSectionView section={section} portalBase="/portal/innovation" />;
  }

  if (!innovatorSections.includes(section)) notFound();

  if (section === "documents" || section === "agreements") {
    return (
      <GlassCard>
        <h1 className="text-2xl font-bold mb-2 capitalize">{section}</h1>
        <p className="text-muted-foreground">
          Scope documents, signed agreements, and deliverables appear here after Finance sends your proposal.
          Check <strong>Invoices</strong> and <strong>Track submissions</strong> for finance and delivery updates.
        </p>
      </GlassCard>
    );
  }

  return <InnovatorSectionView section={section} />;
}
