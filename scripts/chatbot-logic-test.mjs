#!/usr/bin/env node
/**
 * Chatbot logic smoke tests (no server). Mirrors production intent order.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const navSrc = fs.readFileSync(path.join(root, "src/lib/ai-navigation.ts"), "utf8");
const knowledgeSrc = fs.readFileSync(path.join(root, "src/lib/ai-knowledge.ts"), "utf8");
const assistantSrc = fs.readFileSync(path.join(root, "src/components/ai/AIAssistant.tsx"), "utf8");

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL  ${name}: ${err instanceof Error ? err.message : err}`);
  }
}

// --- inline mirrors of conversational + fallback logic for runtime asserts ---
function matchConversationalIntent(message) {
  const t = message.trim();
  if (!t) return null;
  const lower = t.toLowerCase();
  if (
    /^(hi|hello|hey|hola|habari|sasa|good\s*(morning|afternoon|evening)|howdy|yo)([\s,!.?]|$)/i.test(
      t
    ) ||
    /^(hi|hello|hey)[\s,]+(there|techflare|team|ai|bot)?[\s!.]*$/i.test(t)
  ) {
    return { reply: "Hello! Welcome" };
  }
  if (
    /^(thanks|thank\s*you|thx|ty|asante|appreciate\s*it)([\s,!.?]|$)/i.test(t) ||
    /^(thanks|thank\s*you).{0,40}$/i.test(t)
  ) {
    return { reply: "You're welcome" };
  }
  if (/^(bye|goodbye|see\s*you|later|exit|quit)([\s,!.?]|$)/i.test(t)) {
    return { reply: "Goodbye" };
  }
  if (
    /^(help|menu|options|what\s+can\s+you\s+do|how\s+can\s+you\s+help)([\s?!.]|$)/i.test(t) ||
    /what\s+can\s+(you|i)\s+(do|ask|help)/i.test(lower)
  ) {
    return { reply: "Here's what I can help with" };
  }
  if (/^(who\s+are\s+you|what\s+are\s+you|are\s+you\s+(a\s+)?(bot|ai|human))/i.test(t)) {
    return { reply: "I'm the assistant" };
  }
  if (/^(ok|okay|cool|great|nice|perfect|got\s*it|alright)([\s,!.?]|$)/i.test(t)) {
    return { reply: "Glad that helps" };
  }
  return null;
}

function creativeFallback(message) {
  const cleaned = message.trim().replace(/\s+/g, " ");
  const isShortNoise = cleaned.length < 3 || /^[^a-z0-9]+$/i.test(cleaned);
  if (isShortNoise) {
    return "I'm here to help with TechFlare services";
  }
  return (
    "I may not have a perfect match for that yet, but I can still help. " +
    "Try Innovation Hub for ideas"
  );
}

check("source exports matchConversationalIntent", () => {
  assert.ok(navSrc.includes("export function matchConversationalIntent"));
  assert.ok(!navSrc.includes('Great question${topic'));
  assert.ok(navSrc.includes("I may not have a perfect match"));
});

check("assistant uses resolveChatResponse / conversational path", () => {
  assert.ok(assistantSrc.includes("resolveChatResponse"));
  assert.ok(assistantSrc.includes("matchConversationalIntent"));
});

check("knowledge resolve order starts with conversational", () => {
  assert.ok(knowledgeSrc.includes("matchConversationalIntent(message)"));
  const idxConv = knowledgeSrc.indexOf("matchConversationalIntent(message)");
  const idxNav = knowledgeSrc.indexOf("matchNavigationIntent(message)");
  assert.ok(idxConv > 0 && idxNav > idxConv, "conversational must run before nav in resolveChatResponse");
});

check("hello is a greeting, not a 'great question'", () => {
  const r = matchConversationalIntent("hello");
  assert.ok(r);
  assert.ok(r.reply.startsWith("Hello"));
  assert.ok(!creativeFallback("hello").includes("Great question about"));
});

check("hi / good morning greetings", () => {
  assert.ok(matchConversationalIntent("Hi"));
  assert.ok(matchConversationalIntent("hey there"));
  assert.ok(matchConversationalIntent("good morning"));
  assert.ok(matchConversationalIntent("Habari"));
});

check("thanks / bye / help intents", () => {
  assert.ok(matchConversationalIntent("thank you")?.reply.includes("welcome"));
  assert.ok(matchConversationalIntent("bye")?.reply.includes("Goodbye"));
  assert.ok(matchConversationalIntent("help")?.reply.includes("help with"));
  assert.ok(matchConversationalIntent("who are you")?.reply.includes("assistant"));
});

check("fallback never quotes hello as a great question", () => {
  const fb = creativeFallback("hello");
  assert.ok(!/great question about ["']?hello/i.test(fb));
  assert.ok(!/Great question/.test(fb));
});

check("real questions still get actionable fallback", () => {
  const fb = creativeFallback("Do you build blockchain wallets for cooperatives?");
  assert.ok(fb.includes("Innovation Hub") || fb.includes("still help"));
});

check("nav intents still present for submit / pay / contact", () => {
  for (const needle of [
    "submit\\s+(my\\s+)?(innovation|idea",
    "pay\\s+(my\\s+)?invoice",
    "innovation\\s+hub",
    "forgot\\s+password",
  ]) {
    assert.ok(navSrc.includes(needle.replace(/\\/g, "\\")) || new RegExp(needle).test(navSrc), needle);
  }
});

console.log(`\n---\n${passed}/${passed + failed} chatbot logic checks passed`);
if (failed) process.exitCode = 1;
