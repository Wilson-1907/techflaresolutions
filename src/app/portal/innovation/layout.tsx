import { redirect } from "next/navigation";
import { getSessionFull, requireRole } from "@/lib/auth";
import { PortalSidebar } from "@/components/portal/PortalSidebar";

export default async function InnovationPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionFull();
  if (!user || !requireRole(user, ["INNOVATOR"])) {
    redirect("/login?redirect=/portal/innovation");
  }

  return (
    <div className="flex pt-16 min-h-screen">
      <PortalSidebar type="innovation" />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
