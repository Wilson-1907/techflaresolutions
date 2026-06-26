"use client";

import { useState } from "react";
import { Copy, Check, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatPortalDate, statusBadge } from "./usePortalData";
import { buildEmailComposeLink } from "@/lib/mailto";

export type PortalTicket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
};

function ticketSummary(ticket: PortalTicket) {
  return [
    `Ticket ID: ${ticket.id}`,
    `Subject: ${ticket.subject}`,
    `Status: ${ticket.status}`,
    `Priority: ${ticket.priority}`,
    `Opened: ${formatPortalDate(ticket.createdAt)}`,
    "",
    ticket.message,
  ].join("\n");
}

function TicketCard({ ticket }: { ticket: PortalTicket }) {
  const [copied, setCopied] = useState(false);

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(ticketSummary(ticket));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const emailHref = buildEmailComposeLink(
    { type: "support", topic: ticket.subject },
    {
      extraLines: [
        `Ticket ID: ${ticket.id}`,
        `Status: ${ticket.status}`,
        "",
        "My message:",
        ticket.message,
        "",
        "Additional note:",
      ],
    }
  );

  return (
    <GlassCard>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{ticket.subject}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {ticket.priority} priority · opened {formatPortalDate(ticket.createdAt)}
          </p>
          <p className="text-[11px] text-muted-foreground/80 mt-1 font-mono truncate" title={ticket.id}>
            Ref: {ticket.id.slice(0, 12)}…
          </p>
        </div>
        <span className={`capitalize text-sm shrink-0 ${statusBadge(ticket.status)}`}>{ticket.status}</span>
      </div>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">{ticket.message}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={copyDetails}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy details"}
        </Button>
        <Button href={emailHref} size="sm" variant="outline">
          <Mail className="h-4 w-4" />
          Email us about this
        </Button>
      </div>
    </GlassCard>
  );
}

export function SupportTicketList({ tickets }: { tickets: PortalTicket[] }) {
  if (tickets.length === 0) {
    return (
      <GlassCard>
        <p className="text-muted-foreground">No tickets yet. Use the form above to send one — it only takes a minute.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((t) => (
        <TicketCard key={t.id} ticket={t} />
      ))}
    </div>
  );
}
