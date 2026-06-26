"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api-base";
import { SubmissionSuccessBanner } from "./SubmissionSuccessMessage";

export type RevisionTarget = {
  id: string;
  type: "project" | "solution" | "idea" | "order" | "workflow";
  title: string;
  subtitle?: string;
};

type Props = {
  items: RevisionTarget[];
  emptyMessage?: string;
};

export function QuickRevisionPanel({
  items,
  emptyMessage = "When you have an active project or request, tap it here to ask for a change.",
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const selected = items.find((i) => i.id === selectedId);

  async function send() {
    if (!selected || !message.trim()) return;
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch(apiUrl("/api/me/revisions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetType: selected.type,
          targetId: selected.id,
          targetTitle: selected.title,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setFeedback("success");
      setMessage("");
      setSelectedId(null);
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Could not send. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <GlassCard className="border-life-green/20">
        <h3 className="font-bold mb-2">Ask for a change</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border-life-green/20">
      <h3 className="font-bold mb-1">Ask for a change</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Tap your project or request, type what you want fixed or improved, then send. Example: &quot;Ensure accountability in the reports.&quot;
      </p>

      {feedback === "success" && (
        <SubmissionSuccessBanner detail="Your change request is in. Track the project or request status on this page — wait for our team to approve or reject the update." />
      )}
      {feedback && feedback !== "success" && (
        <p className="text-sm mb-3 text-red-400">{feedback}</p>
      )}

      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setSelectedId(item.id);
              setFeedback("");
            }}
            className={cn(
              "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors",
              selectedId === item.id
                ? "border-life-green/50 bg-life-green/10"
                : "border-white/10 bg-white/5 hover:border-gold/30"
            )}
          >
            <span className="font-medium block">{item.title}</span>
            {item.subtitle && (
              <span className="text-xs text-muted-foreground capitalize">{item.subtitle}</span>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-3 rounded-xl border border-gold/20 bg-black/20 p-4">
          <p className="text-sm">
            Change for: <strong className="text-gold">{selected.title}</strong>
          </p>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='e.g. "Ensure accountability in the final report"'
            className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 text-sm resize-none"
            autoFocus
          />
          <Button type="button" size="sm" disabled={loading || message.trim().length < 3} onClick={send}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send change request
          </Button>
        </div>
      )}
    </GlassCard>
  );
}
