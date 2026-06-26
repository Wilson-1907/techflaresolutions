"use client";

import { usePathname } from "next/navigation";
import { AIAssistant } from "@/components/ai/AIAssistant";

/** Site chatbot only — not shown inside member workspaces. */
export function ConditionalAIAssistant() {
  const pathname = usePathname();
  if (pathname.startsWith("/portal")) return null;
  return <AIAssistant />;
}
