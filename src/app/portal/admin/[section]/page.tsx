import { redirect } from "next/navigation";
import { getAdminPanelUrl } from "@/lib/env";

export default function AdminSectionRedirect() {
  redirect(`${getAdminPanelUrl()}/dashboard`);
}
