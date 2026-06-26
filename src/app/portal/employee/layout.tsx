import { redirect } from "next/navigation";
import { getSessionFull, requireRole } from "@/lib/auth";
import { getPortalPathForRole } from "@/lib/portal-routes";
import { PortalShell } from "@/components/portal/PortalShell";

export default async function EmployeePortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionFull();
  if (!user) {
    redirect("/login?redirect=/portal/employee");
  }
  if (!requireRole(user, ["EMPLOYEE", "HOD", "CIO"])) {
    redirect(getPortalPathForRole(user.role));
  }

  return <PortalShell type="employee">{children}</PortalShell>;
}
