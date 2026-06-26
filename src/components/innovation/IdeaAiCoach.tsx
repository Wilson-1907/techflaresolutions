"use client";

import { useCallback, useEffect, useState } from "react";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { industries } from "@/data/site";
import { formSelectClass } from "@/lib/form-styles";
import { SUBMISSION_HINT, SUBMISSION_LIMITS } from "@/lib/submission-limits";
import { apiUrl } from "@/lib/api-base";
import { AiSessionPaywall } from "@/components/ai/AiSessionPaywall";

type ChatMsg = { role: "user" | "assistant"; content: string };

type SessionStatus = {
  active: boolean;
  priceKes: number;
  durationHours: number;
  remainingMs: number;
};

export function IdeaAiCoach() {
  const [form, setForm] = useState({ title: "", category: "", description: "" });
  const [session, setSession] = useState<SessionStatus | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [aiHistory, setAiHistory] = useState<ChatMsg[]>([]);
  const [followUp, setFollowUp] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/api/me/ai-session"), { credentials: "include" });
      if (res.ok) {
        setSession(await res.json());
      } else {
        setSession({ active: false, priceKes: 100, durationHours: 12, remainingMs: 0 });
      }
    } catch {
      setSession({ active: false, priceKes: 100, durationHours: 12, remainingMs: 0 });
    } finally {
      setSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  async function runAi(message?: string) {
    if (!form.title.trim() || !form.description.trim()) {
      setError("Write your idea title and description first.");
      return;
    }
    setError("");

    if (!session?.active) {
      setShowPaywall(true);
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch(apiUrl("/api/ai/fine-tune"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          message: message || undefined,
          history: aiHistory,
        }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setShowPaywall(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || data.message || "AI request failed");

      const userContent = message || "Please help me improve this idea.";
      setAiHistory((prev) => [
        ...prev,
        { role: "user", content: userContent },
        { role: "assistant", content: data.reply },
      ]);
      setFollowUp("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI request failed");
    } finally {
      setAiLoading(false);
    }
  }

  if (sessionLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GlassCard className="border-gold/20">
        <div className="flex items-start gap-3 mb-4">
          <Bot className="h-7 w-7 text-gold shrink-0" />
          <div>
            <h2 className="text-xl font-bold">Improve your idea with AI</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Type your idea below. When you tap <strong>Get AI help</strong>, pay{" "}
              <strong className="text-gold">KES {session?.priceKes ?? 100}</strong> by M-Pesa for a{" "}
              {session?.durationHours ?? 12}-hour session — then chat with AI to sharpen your idea.
              This does not submit to our team (use Submit Idea for that).
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Idea title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              maxLength={SUBMISSION_LIMITS.ideaTitleMax}
              placeholder="Short, clear title"
              className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={formSelectClass}
            >
              <option value="">Select category</option>
              {industries.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Your idea</label>
            <textarea
              rows={6}
              minLength={SUBMISSION_LIMITS.ideaDescriptionMin}
              maxLength={SUBMISSION_LIMITS.ideaDescriptionMax}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What is it, who benefits, what you need..."
              className="w-full rounded-xl border border-gold/20 bg-deep-blue/50 px-4 py-3 text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{SUBMISSION_HINT}</p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {session?.active && (
            <p className="text-sm text-life-green">
              AI session active — {Math.floor((session.remainingMs || 0) / 3600000)}h left
            </p>
          )}

          <Button
            type="button"
            onClick={() => runAi()}
            disabled={aiLoading || !form.title.trim() || !form.description.trim()}
          >
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Get AI help
          </Button>
        </div>
      </GlassCard>

      {showPaywall && !session?.active && (
        <AiSessionPaywall
          featureLabel="AI Idea Coach"
          onPaid={async () => {
            await refreshSession();
            setShowPaywall(false);
          }}
          onCancel={() => setShowPaywall(false)}
        />
      )}

      {aiHistory.length > 0 && (
        <GlassCard>
          <h3 className="font-bold mb-3">AI conversation</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
            {aiHistory.map((m, i) => (
              <div key={i} className={`text-sm rounded-xl p-3 ${m.role === "assistant" ? "bg-life-green/10" : "bg-white/5"}`}>
                <span className="font-medium text-gold capitalize">{m.role === "assistant" ? "AI" : "You"}: </span>
                <span className="text-muted-foreground whitespace-pre-wrap">{m.content}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Ask a follow-up..."
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
            />
            <Button type="button" size="sm" disabled={aiLoading || !followUp.trim()} onClick={() => runAi(followUp)}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
