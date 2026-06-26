import { redirect } from "next/navigation";

/** Company blog is read-only on the public site — no user posts here. */
export default function BlogWriteRedirect() {
  redirect("/blog");
}
