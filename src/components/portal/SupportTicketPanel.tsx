"use client";

import { useState } from "react";
import { HeadphonesIcon, Loader2, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/site";
import { formSelectClass } from "@/lib/form-styles";
import { apiUrl } from "@/lib/api-base";
import { buildEmailComposeLink } from "@/lib/mailto";
import { SubmissionSuccessBanner } from "./SubmissionSuccessMessage";

export function SupportTicketPanel({ onSubmitted }: { onSubmitted?: () => void }) {
  const [form, setForm] = useState({ subject: "", message: "", priority: "medium" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusText, setStatusText] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setStatusText("");
    try {
      const res = await fetch(apiUrl("/api/me/tickets"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      setStatusText(
        data.ticketId
          ? `Reference: ${data.ticketId.slice(0, 12)}… — find it in Your tickets below.`
          : "Find it in Your tickets below."
      );
      setForm({ subject: "", message: "", priority: "medium" });
      onSubmitted?.();
    } catch (e) {
      setStatus("error");
      setStatusText(e instanceof Error ? e.message : "Could not send ticket.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <GlassCard className="border-gold/20">
        <div className="flex items-start gap-3">
          <HeadphonesIcon className="h-6 w-6 text-gold shrink-0 mt-0.5" aria-hidden />
          <div>
            <h3 className="font-bold mb-2">What are support tickets for?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              Tickets are for <strong className="text-foreground">help with your account, billing, login, or something broken</strong> — not for project changes.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fill in the form below and tap <strong className="text-foreground">Send ticket</strong>. We reply by email and you can track status here. To follow up, copy your ticket details or tap <strong className="text-foreground">Email us about this</strong> on any ticket.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              For project changes, go to <strong className="text-foreground">Projects</strong> or <strong className="text-foreground">My requests</strong> and send a revision from there.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-bold mb-3">Open a support ticket</h3>
        {status === "success" && (
          <SubmissionSuccessBanner
            detail={`${statusText} Our support team will respond — please wait. You will see updates here when the ticket is resolved.`}
          />
        )}
        {status === "error" && (
          <p className="text-sm mb-3 text-red-400">{statusText}</p>
        )}
        <form onSubmit={submit} className="space-y-3">
          <input
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="What do you need help with? e.g. Cannot log in"
            className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-2.5 text-sm"
          />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className={`${formSelectClass} w-full text-sm py-2.5`}
          >
            <option value="low">Low — general question</option>
            <option value="medium">Medium — needs attention</option>
            <option value="high">High — urgent issue</option>
          </select>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Explain your issue in simple words..."
            className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-2.5 text-sm resize-none"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send ticket
            </Button>
            <Button
              href={buildEmailComposeLink({ type: "support" })}
              size="sm"
              variant="outline"
            >
              Email us
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground mt-3">
          Or email {company.email} directly.
        </p>
      </GlassCard>
    </div>
  );
}
