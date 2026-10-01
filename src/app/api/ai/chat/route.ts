import { NextRequest, NextResponse } from "next/server";
import { rateLimit, validateOrigin } from "@/lib/security";
import { AI_SYSTEM_PROMPT, matchKnowledge } from "@/lib/ai-knowledge";

function getAIResponse(message: string): string {
  const matched = matchKnowledge(message);
  if (matched) return matched;

  if (process.env.OPENAI_API_KEY) {
    return "OPENAI_FALLBACK";
  }

  return "I'm TechFlare Solutions AI! Ask me about our services, Innovation Hub, products, Solutions Center, community, careers, contact info, or how to order without logging in.";
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 30, 60_000);
  if (limited) return limited;

  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  try {
    const { message, history } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    let reply = getAIResponse(message);

    if (reply === "OPENAI_FALLBACK" && process.env.OPENAI_API_KEY) {
      try {
        const historyMessages = Array.isArray(history)
          ? history.slice(-6).map((m: { role: string; content: string }) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.content,
            }))
          : [];

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: AI_SYSTEM_PROMPT },
              ...historyMessages,
              { role: "user", content: message },
            ],
            max_tokens: 400,
          }),
        });
        const data = await res.json();
        reply = data.choices?.[0]?.message?.content || matchKnowledge(message);
        if (!reply || reply === "OPENAI_FALLBACK") {
          reply = matchKnowledge(message) || "How can I help you with TechFlare Solutions today?";
        }
      } catch {
        reply =
          matchKnowledge(message) ||
          "I'm TechFlare Solutions AI — ask about services, products, Innovation Hub, or contact us at solutionstechflare@gmail.com.";
      }
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
  }
}
