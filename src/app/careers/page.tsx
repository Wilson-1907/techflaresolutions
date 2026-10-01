import { Metadata } from "next";
import { CareersClient } from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join TechFlare Solutions. Community membership required to apply.",
};

export default function CareersPage() {
  return <CareersClient />;
}
