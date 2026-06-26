import { redirect } from "next/navigation";
import { getAdminPanelUrl } from "@/lib/env";

export default function AdminPortalRedirect() {
  redirect(`${getAdminPanelUrl()}/dashboard`);
}
