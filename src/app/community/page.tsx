import { Metadata } from "next";
import { CommunityClient } from "./CommunityClient";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the TechFlare Solutions WhatsApp community — separate from your website account.",
};

export default function CommunityPage() {
  return <CommunityClient />;
}
