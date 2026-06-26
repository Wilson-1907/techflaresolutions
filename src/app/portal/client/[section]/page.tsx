import { notFound } from "next/navigation";
import { ClientSectionView } from "@/components/portal/ClientPortalViews";

const sections = [
  "submit", "projects", "orders", "services", "revisions", "invoices", "payments", "points", "support",
  "documents", "messages", "testimonials", "ratings",
];

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}

export default async function ClientSectionPage({ params }: Props) {
  const { section } = await params;
  if (!sections.includes(section)) notFound();
  return <ClientSectionView section={section} />;
}
