import { redirect } from "next/navigation";
import { getSessionFull, requireRole } from "@/lib/auth";
import { getPortalPathForRole } from "@/lib/portal-routes";
import { PortalShell } from "@/components/portal/PortalShell";

export default async function InnovationPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionFull();
  if (!user) {
    redirect("/login?redirect=/portal/innovation");
  }
  if (!requireRole(user, ["INNOVATOR"])) {
    redirect(getPortalPathForRole(user.role));
  }

  return <PortalShell type="innovation">{children}</PortalShell>;
}
