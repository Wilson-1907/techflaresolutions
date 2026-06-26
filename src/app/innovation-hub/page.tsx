import { redirect } from "next/navigation";
import { getSessionFull } from "@/lib/auth";
import { getPortalPathForRole } from "@/lib/portal-routes";
import { InnovationHubPublic } from "./InnovationHubPublic";

export default async function InnovationHubPage() {
  const user = await getSessionFull();
  if (user) {
    if (user.role === "INNOVATOR") {
      redirect("/portal/innovation/ai");
    }
    redirect(getPortalPathForRole(user.role));
  }

  return <InnovationHubPublic />;
}
