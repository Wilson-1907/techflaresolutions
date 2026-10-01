"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Bell } from "lucide-react";
import { buildFollowUpMessage, buildFollowUpNotificationBody } from "@/lib/ai-knowledge";

const FOLLOW_UP_DELAY_MS = 2 * 60 * 1000; // 2 minutes after last reply
const STORAGE_KEY = "techflare-ai-last-question";

const quickQuestions = [
  "What services does TechFlare Solutions offer?",
  "How does the Innovation Hub work?",
  "How can I order a voting system?",
  "What industries do you serve?",
];

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  isFollowUp?: boolean;
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm TechFlare Solutions AI. Ask me about our services, Innovation Hub, products, Solutions Center, community, or how to contact us.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const followUpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUserQuestion = useRef<string | null>(null);
  const followUpSent = useRef(false);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) lastUserQuestion.current = stored;
  }, []);

  const clearFollowUpTimer = useCallback(() => {
    if (followUpTimer.current) {
      clearTimeout(followUpTimer.current);
      followUpTimer.current = null;
    }
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    if (openRef.current) return;

    try {
      const n = new Notification(title, {
        body,
        icon: "/logo.png",
        tag: "techflare-ai-followup",
      });
      n.onclick = () => {
        window.focus();
        setOpen(true);
        n.close();
      };
    } catch {
      // ignore notification errors
    }
  }, []);

  const scheduleFollowUp = useCallback(() => {
    clearFollowUpTimer();
    const question = lastUserQuestion.current;
    if (!question || followUpSent.current) return;

    followUpTimer.current = setTimeout(() => {
      if (!lastUserQuestion.current) return;

      const followUpText = buildFollowUpMessage(lastUserQuestion.current);
      followUpSent.current = true;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: followUpText, isFollowUp: true },
      ]);

      if (!openRef.current) {
        setUnread((c) => c + 1);
        showNotification(
          "TechFlare Solutions AI",
          buildFollowUpNotificationBody(lastUserQuestion.current!)
        );
      }
    }, FOLLOW_UP_DELAY_MS);
  }, [clearFollowUpTimer, showNotification]);

  const requestNotifications = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
      setNotificationsEnabled(true);
      return;
    }
    if (Notification.permission !== "denied") {
      const result = await Notification.requestPermission();
      setNotificationsEnabled(result === "granted");
    }
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userText = text.trim();
    lastUserQuestion.current = userText;
    sessionStorage.setItem(STORAGE_KEY, userText);
    followUpSent.current = false;
    clearFollowUpTimer();

    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history }),
      });
      const data = await res.json();
      const reply =
        data.reply ||
        "I'm having trouble right now. Contact us at solutionstechflare@gmail.com or WhatsApp 0769227291.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      scheduleFollowUp();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection issue — please try again or email solutionstechflare@gmail.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => () => clearFollowUpTimer(), [clearFollowUpTimer]);

  return (
    <>
      <motion.button
        onClick={() => {
          setOpen(true);
          requestNotifications();
        }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-deep-blue-mid text-white shadow-lg shadow-gold/30 hover:scale-105 transition-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-life-green px-1 text-[10px] font-bold text-black">
            {unread}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-gold/20 to-gold-dark/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <span className="font-semibold">TechFlare Solutions AI</span>
              </div>
              <div className="flex items-center gap-1">
                {!notificationsEnabled && (
                  <button
                    type="button"
                    onClick={requestNotifications}
                    className="rounded-lg p-1.5 hover:bg-white/10 text-muted-foreground"
                    title="Enable follow-up notifications"
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-gold text-white"
                        : msg.isFollowUp
                          ? "bg-life-green/15 border border-life-green/30 text-foreground"
                          : "bg-white/10 text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-1 px-4">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gold" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gold [animation-delay:0.1s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gold [animation-delay:0.2s]" />
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-2 flex flex-wrap gap-1">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-white/10 px-2 py-0.5 text-xs hover:bg-white/10"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about TechFlare Solutions..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gold p-2 text-white hover:bg-gold disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
