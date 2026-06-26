"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bell, Navigation } from "lucide-react";
import {
  buildFollowUpMessage,
  buildFollowUpNotificationBody,
  matchKnowledge,
} from "@/lib/ai-knowledge";
import { company } from "@/data/site";
import {
  creativeFallback,
  matchNavigationConfirmation,
  matchNavigationIntent,
  type ChatAction,
} from "@/lib/ai-navigation";

const FOLLOW_UP_DELAY_MS = 2 * 60 * 1000;
const STORAGE_KEY = "techflare-ai-last-question";
const GUEST_HISTORY_KEY = "techflare-ai-guest-history";
const USER_HISTORY_PREFIX = "techflare-ai-history-";
const NAV_DELAY_MS = 1200;
const MAX_STORED_MESSAGES = 40;

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm here to help in plain English. Ask anything about TechFlare — or say things like \"how do I submit my idea\" or \"take me to pay my bill\" and I'll guide you step by step.",
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  isFollowUp?: boolean;
  action?: ChatAction;
};

type StoredChatMessage = Pick<ChatMessage, "role" | "content" | "isFollowUp">;

function loadGuestHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];
  try {
    const raw = sessionStorage.getItem(GUEST_HISTORY_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw) as StoredChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [WELCOME_MESSAGE];
    return [WELCOME_MESSAGE, ...parsed.filter((m) => m.role === "user" || m.role === "assistant")];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

function isWelcomeMessage(m: ChatMessage) {
  return m.role === "assistant" && m.content === WELCOME_MESSAGE.content;
}

function persistGuestHistory(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  const toStore = messages
    .filter((m) => !isWelcomeMessage(m) && !m.isFollowUp)
    .slice(-MAX_STORED_MESSAGES)
    .map(({ role, content, isFollowUp }) => ({ role, content, isFollowUp }));
  sessionStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(toStore));
}

function loadUserHistory(userId: string): ChatMessage[] {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];
  try {
    const raw = localStorage.getItem(`${USER_HISTORY_PREFIX}${userId}`);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw) as StoredChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [WELCOME_MESSAGE];
    return [WELCOME_MESSAGE, ...parsed.filter((m) => m.role === "user" || m.role === "assistant")];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

function persistUserHistory(userId: string, messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  const toStore = messages
    .filter((m) => !isWelcomeMessage(m) && !m.isFollowUp)
    .slice(-MAX_STORED_MESSAGES)
    .map(({ role, content, isFollowUp }) => ({ role, content, isFollowUp }));
  localStorage.setItem(`${USER_HISTORY_PREFIX}${userId}`, JSON.stringify(toStore));
}

const quickQuestions = [
  "How do I submit my idea?",
  "Where do I pay my bill?",
  "I need help logging in",
  "Take me to my portal",
];

export function AIAssistant() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [signedInUserId, setSignedInUserId] = useState<string | null>(null);
  const [historyReady, setHistoryReady] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(true);

  const followUpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUserQuestion = useRef<string | null>(null);
  const followUpSent = useRef(false);
  const openRef = useRef(open);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingNavPath = useRef<string | null>(null);

  const performNavigation = useCallback(
    (action: ChatAction) => {
      const go = () => {
        setOpen(false);
        router.push(action.path);
      };
      if (action.auto) {
        setTimeout(go, NAV_DELAY_MS);
      } else {
        go();
      }
    },
    [router]
  );

  const applyAssistantReply = useCallback(
    (reply: string, action?: ChatAction) => {
      if (action && !action.auto) {
        pendingNavPath.current = action.path;
      } else if (action?.auto) {
        pendingNavPath.current = null;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply, action }]);

      if (action?.auto) {
        performNavigation(action);
      }
    },
    [performNavigation]
  );

  useEffect(() => {
    openRef.current = open;
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) lastUserQuestion.current = stored;
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const userId = data?.user?.id as string | undefined;
        if (userId) {
          setSignedInUserId(userId);
          setMessages(loadUserHistory(userId));
        } else {
          setSignedInUserId(null);
          setMessages(loadGuestHistory());
        }
        setHistoryReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setSignedInUserId(null);
          setMessages(loadGuestHistory());
          setHistoryReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!historyReady) return;
    if (signedInUserId) {
      persistUserHistory(signedInUserId, messages);
    } else {
      persistGuestHistory(messages);
    }
  }, [messages, signedInUserId, historyReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

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

    const localConfirm = matchNavigationConfirmation(userText, pendingNavPath.current ?? undefined);
    if (localConfirm) {
      setMessages((prev) => [...prev, { role: "user", content: userText }]);
      setInput("");
      pendingNavPath.current = null;
      applyAssistantReply(localConfirm.reply, localConfirm.action);
      setShowQuickMenu(false);
      scheduleFollowUp();
      return;
    }

    const localNav = matchNavigationIntent(userText);
    if (localNav) {
      setMessages((prev) => [...prev, { role: "user", content: userText }]);
      setInput("");
      applyAssistantReply(localNav.reply, localNav.action);
      setShowQuickMenu(false);
      scheduleFollowUp();
      return;
    }

    const localKnowledge = matchKnowledge(userText);
    if (localKnowledge) {
      setMessages((prev) => [...prev, { role: "user", content: userText }]);
      setInput("");
      applyAssistantReply(localKnowledge);
      setShowQuickMenu(false);
      scheduleFollowUp();
      return;
    }

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
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg =
          data.error ||
          (res.status === 429
            ? "Too many messages — please wait a moment and try again."
            : `I'm reconnecting — meanwhile reach us at ${company.email} or WhatsApp ${company.phone}. Try asking again in a few seconds!`);
        setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
        return;
      }

      const reply = data.reply || creativeFallback(userText);
      const action = data.action as ChatAction | undefined;
      applyAssistantReply(reply, action);
      setShowQuickMenu(false);
      scheduleFollowUp();
    } catch {
      applyAssistantReply(creativeFallback(userText));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => () => clearFollowUpTimer(), [clearFollowUpTimer]);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={() => {
              setOpen(true);
              requestNotifications();
            }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-0 overflow-hidden rounded-full border border-gold/30 bg-gradient-to-r from-deep-blue via-deep-blue-mid to-deep-blue text-white shadow-xl shadow-black/40 hover:shadow-gold/20 transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Open TechFlare AI chat"
          >
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={33}
                unoptimized
                className="h-10 w-auto object-contain bg-transparent"
                aria-hidden
              />
              <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-deep-blue bg-life-green" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-life-green px-1 text-[10px] font-bold text-black">
                  {unread}
                </span>
              )}
            </span>
            <span className="hidden sm:block pr-5 pl-1 text-left">
              <span className="block text-sm font-semibold leading-tight">TechFlare AI</span>
              <span className="block text-[11px] text-gold/90">Ask us anything</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex h-[min(500px,calc(100vh-6rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="shrink-0 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-gold/20 to-gold-dark/20 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt=""
                    width={36}
                    height={30}
                    unoptimized
                    className="h-8 w-auto object-contain bg-transparent"
                    aria-hidden
                  />
                </div>
                <div>
                  <span className="block font-semibold leading-tight">TechFlare Solutions AI</span>
                  <span className="block text-[11px] text-life-green">Online now</span>
                </div>
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

            <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-3">
              {!signedInUserId && messages.length > 1 && (
                <p className="rounded-lg border border-gold/20 bg-gold/5 px-3 py-2 text-[11px] text-muted-foreground">
                  Chat is saved for this browser session only.{" "}
                  <Link href="/login" className="text-gold hover:underline">
                    Sign in
                  </Link>{" "}
                  to keep history across visits.
                </p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-gold text-white"
                        : msg.isFollowUp
                          ? "bg-life-green/15 border border-life-green/30 text-foreground"
                          : "bg-white/10 text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" && !msg.isFollowUp && (
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <Image
                          src="/logo.png"
                          alt=""
                          width={16}
                          height={13}
                          unoptimized
                          className="h-4 w-auto object-contain bg-transparent"
                          aria-hidden
                        />
                        <span className="text-[10px] font-medium text-gold">TechFlare AI</span>
                      </div>
                    )}
                    {msg.content}
                    {msg.action && !msg.action.auto && (
                      <button
                        type="button"
                        onClick={() => performNavigation({ ...msg.action!, auto: true })}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gold/20 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/30"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        {msg.action.label}
                      </button>
                    )}
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
              <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 border-t border-white/10 bg-background/95 p-3">
              {showQuickMenu && (
                <div className="mb-2">
                  <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Suggested questions
                  </p>
                  <div className="flex max-h-16 flex-wrap gap-1 overflow-y-auto">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendMessage(q)}
                        disabled={loading}
                        className="rounded-full border border-white/10 px-2 py-0.5 text-xs hover:bg-white/10 disabled:opacity-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!showQuickMenu && (
                <button
                  type="button"
                  onClick={() => setShowQuickMenu(true)}
                  className="mb-2 text-[11px] text-gold hover:underline"
                >
                  Show suggested questions
                </button>
              )}
              <p className="mb-2 text-[10px] text-muted-foreground">
                Answers use our{" "}
                <Link href="/terms" className="text-gold hover:underline">
                  official Terms &amp; Payment policy
                </Link>
              </p>
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
                  disabled={loading || !input.trim()}
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
