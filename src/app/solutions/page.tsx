import { Metadata } from "next";
import { SolutionsClient } from "./SolutionsClient";

export const metadata: Metadata = {
  title: "Solutions Center",
  description: "Describe your problem and TechFlare Solutions will propose tailored solutions.",
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
