"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { buildEmailComposeLink } from "@/lib/mailto";
import { company } from "@/data/site";
import { apiUrl } from "@/lib/api-base";

export function RevisionRequestForm({ projectRef = "" }: { projectRef?: string }) {
  const [form, setForm] = useState({ subject: projectRef, details: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: "Portal User",
          email: "portal@revision",
          subject: `Revision Request: ${form.subject}`,
          message: form.details,
          type: "revision",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setMessage("Revision request sent. Admin will forward it to the development team.");
      setForm({ subject: projectRef, details: "" });
    } catch {
      setMessage("Could not send request. Email us directly at stechflare@gmail.com");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="border-life-green/20">
      <h3 className="font-bold mb-2">Request a Revision</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Submit changes through your portal. Admin receives your request and forwards it to the development team.
      </p>
      {message && <p className="text-sm text-life-green mb-3">{message}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="Project / idea / invoice reference"
          className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-2.5 text-sm"
        />
        <textarea
          required
          rows={4}
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          placeholder="Describe the revision you need..."
          className="w-full rounded-xl border border-gold/20 bg-black/30 px-4 py-2.5 text-sm resize-none"
        />
        <Button type="submit" size="sm" disabled={loading}>{loading ? "Sending..." : "Send Revision Request"}</Button>
        <p className="text-xs text-muted-foreground pt-2">
          Or{" "}
          <a
            href={buildEmailComposeLink(
              { type: "revision", project: form.subject || projectRef },
              { extraLines: form.details ? [`Revision details: ${form.details}`] : undefined }
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Email us
          </a>{" "}
          with subject ready ({company.email})
        </p>
      </form>
    </GlassCard>
  );
}
