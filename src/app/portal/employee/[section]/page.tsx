import { notFound } from "next/navigation";
import { EmployeeSectionView } from "@/components/portal/EmployeePortalViews";

const sections = ["projects", "active", "completed", "invoices", "payments", "notifications", "messages"];

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}

export default async function EmployeeSectionPage({ params }: Props) {
  const { section } = await params;
  if (!sections.includes(section)) notFound();
  return <EmployeeSectionView section={section} />;
}
