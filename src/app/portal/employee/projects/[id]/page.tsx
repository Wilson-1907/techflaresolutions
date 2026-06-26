import { EmployeeProjectDetailView } from "@/components/portal/EmployeePortalViews";

type Props = { params: Promise<{ id: string }> };

export default async function EmployeeProjectPage({ params }: Props) {
  const { id } = await params;
  return <EmployeeProjectDetailView projectId={id} />;
}
