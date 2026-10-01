import { redirect } from "next/navigation";
import { getSessionFull, requireRole } from "@/lib/auth";
import { PortalSidebar } from "@/components/portal/PortalSidebar";

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionFull();
  if (!user || !requireRole(user, ["CLIENT"])) {
    redirect("/login?redirect=/portal/client");
  }

  return (
    <div className="flex pt-16 min-h-screen">
      <PortalSidebar type="client" />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
