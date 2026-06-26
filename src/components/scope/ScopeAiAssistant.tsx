"use client";

import { useState } from "react";
import { Loader2, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { parseJsonResponse } from "@/lib/parse-json";

export type ScopeLineDraft = {
  title: string;
  cost: string;
  quantity: string;
  dueDate: string;
  description: string;
  timeline: string;
};

type Props = {
  onApply: (brief: string, lines: ScopeLineDraft[]) => void;
  apiPath?: string;
};

type GenerateResponse = {
  summary?: string;
  lines?: Array<{
    title: string;
    description?: string;
    cost?: number;
    quantity?: number;
    timeline?: string;
  }>;
  demand?: { multiplier: number; label: string; activeProjects: number };
  error?: string;
};

export function ScopeAiAssistant({ onApply, apiPath = "/api/workflows/generate-scope" }: Props) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [demandLabel, setDemandLabel] = useState("");

  async function generate() {
    if (description.trim().length < 10) {
      setError("Describe the project in a few sentences.");
      return;
    }
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ projectDescription: description.trim() }),
      });
      const data = await parseJsonResponse<GenerateResponse>(res);
      if (!res.ok) throw new Error(data.error || "Generation failed");

      const lines: ScopeLineDraft[] = (data.lines || []).map((l) => ({
        title: l.title || "",
        cost: String(l.cost ?? ""),
        quantity: String(l.quantity ?? 1),
        dueDate: "",
        description: l.description || "",
        timeline: l.timeline || "",
      }));

      if (lines.length === 0) throw new Error("No line items generated — try a more detailed brief.");

      setSummary(data.summary || "");
      setDemandLabel(
        data.demand
          ? `${data.demand.label} (${data.demand.multiplier}× · ${data.demand.activeProjects} active projects)`
          : ""
      );
      onApply(description.trim(), lines);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate scope");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gold/25 bg-gold/5 p-4 space-y-3">
      <p className="text-sm font-medium text-gold flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        AI scope assistant
      </p>
      <p className="text-xs text-muted-foreground">
        Describe the client project in plain language. The assistant uses our <strong>internal service catalog</strong>{" "}
        (staff-only rates) and drafts rows with price and timeline. Edit everything before sending to Finance.
      </p>
      <textarea
        className="w-full rounded-lg border border-gold/20 bg-deep-blue/40 p-3 text-sm min-h-[100px]"
        placeholder="Example: Client wants a simple happy birthday website with a song, 4 sliding photos, and personal messages..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 items-center">
        <Button type="button" size="sm" disabled={loading} onClick={generate}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate scope &amp; prices
        </Button>
        <Button type="button" size="sm" variant="outline" href="/services#catalog">
          <BookOpen className="h-4 w-4" />
          View service list
        </Button>
      </div>
      {demandLabel && <p className="text-xs text-gold/90">{demandLabel}</p>}
      {summary && <p className="text-xs text-life-green">{summary}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
