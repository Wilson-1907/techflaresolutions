import { redirect } from "next/navigation";
import { getSessionFull, requireRole } from "@/lib/auth";
import { getPortalPathForRole } from "@/lib/portal-routes";
import { PortalShell } from "@/components/portal/PortalShell";

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionFull();
  if (!user) {
    redirect("/login?redirect=/portal/client");
  }
  if (!requireRole(user, ["CLIENT"])) {
    redirect(getPortalPathForRole(user.role));
  }

  return <PortalShell type="client">{children}</PortalShell>;
}
