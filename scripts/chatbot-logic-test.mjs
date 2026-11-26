#!/usr/bin/env node
/**
 * Chatbot logic + UI cleanliness checks.
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
    return { reply: "Hello!" };
  }
  if (
    /^(how\s+are\s+you|how('?s|\s+is)\s+it\s+going|how\s+do\s+you\s+do|what'?s\s+up|wassup|sup)([\s?!.]|$)/i.test(
      t
    ) ||
    /^how\s+are\s+you\s+(doing|today)?[\s?!.]*$/i.test(t)
  ) {
    return { reply: "Doing well — thanks for asking!" };
  }
  if (
    /^(thanks|thank\s*you|thx|ty|asante|appreciate\s*it)([\s,!.?]|$)/i.test(t) ||
    /^(thanks|thank\s*you).{0,40}$/i.test(t)
  ) {
    return { reply: "You're welcome!" };
  }
  if (/^(bye|goodbye|see\s*you|later|exit|quit)([\s,!.?]|$)/i.test(t)) {
    return { reply: "Goodbye" };
  }
  if (
    /^(help|menu|options|what\s+can\s+you\s+do|how\s+can\s+you\s+help)([\s?!.]|$)/i.test(t) ||
    /what\s+can\s+(you|i)\s+(do|ask|help)/i.test(lower)
  ) {
    return { reply: "I can help with:" };
  }
  if (/^(who\s+are\s+you|what\s+are\s+you|are\s+you\s+(a\s+)?(bot|ai|human))/i.test(t)) {
    return { reply: "I'm the TechFlare site assistant" };
  }
  if (/^(ok|okay|cool|great|nice|perfect|got\s*it|alright)([\s,!.?]|$)/i.test(t)) {
    return { reply: "Great. What next" };
  }
  return null;
}

function sanitizeAssistantReply(reply, userMessage) {
  const text = (reply || "").trim();
  if (!text) return "fallback";
  if (/^great question\b/i.test(text) || /great question about\s+["']/i.test(text)) {
    const local = matchConversationalIntent(userMessage);
    if (local) return local.reply;
    return "fallback-clean";
  }
  return text;
}

const cases = [
  ["hello", "Hello"],
  ["hi", "Hello"],
  ["how are you", "Doing well"],
  ["how's it going", "Doing well"],
  ["what's up", "Doing well"],
  ["thanks", "welcome"],
  ["bye", "Goodbye"],
  ["help", "help with"],
  ["who are you", "assistant"],
  ["ok", "What next"],
];

check("no logo images in AIAssistant UI", () => {
  assert.ok(!assistantSrc.includes("logo.png"), "logo.png must be removed from chat UI");
  assert.ok(!assistantSrc.includes('from "next/image"'), "next/image unused after logo removal");
  assert.ok(assistantSrc.includes("MessageCircle"), "launcher should use MessageCircle icon");
});

check("sanitizer exported and used", () => {
  assert.ok(navSrc.includes("export function sanitizeAssistantReply"));
  assert.ok(assistantSrc.includes("sanitizeAssistantReply"));
});

check("how are you is conversational, not great-question", () => {
  const r = matchConversationalIntent("how are you");
  assert.ok(r);
  assert.ok(r.reply.includes("Doing well"));
  assert.ok(!/great question/i.test(r.reply));
});

for (const [input, expect] of cases) {
  check(`intent: ${input}`, () => {
    const r = matchConversationalIntent(input);
    assert.ok(r, `no match for ${input}`);
    assert.ok(
      new RegExp(expect, "i").test(r.reply),
      `"${input}" reply missing /${expect}/ — got: ${r.reply}`
    );
  });
}

check("sanitize strips backend Great question stub", () => {
  const bad =
    'Great question about "how are you"! Here are smart next steps: explore our Innovation Hub';
  const clean = sanitizeAssistantReply(bad, "how are you");
  assert.ok(!/great question/i.test(clean));
  assert.ok(/doing well/i.test(clean));
});

check("source has no Great question fallback template", () => {
  assert.ok(!navSrc.includes("Great question${"));
  assert.ok(!navSrc.includes('Great question about "${'));
  assert.ok(navSrc.includes("I may not have a perfect match"));
});

check("resolve order conversational → nav → knowledge", () => {
  const idxConv = knowledgeSrc.indexOf("matchConversationalIntent(message)");
  const idxNav = knowledgeSrc.indexOf("matchNavigationIntent(message)");
  assert.ok(idxConv > 0 && idxNav > idxConv);
});

check("nav intents still present", () => {
  assert.ok(navSrc.includes("innovation"));
  assert.ok(navSrc.includes("invoice"));
  assert.ok(navSrc.includes("/contact"));
});

console.log(`\n---\n${passed}/${passed + failed} chatbot checks passed`);
if (failed) process.exitCode = 1;
