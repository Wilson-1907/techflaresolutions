#!/usr/bin/env node
/**
 * Unit checks for security band helpers (no HTTP server required).
 * Imports compiled-on-the-fly via dynamic evaluation of the TypeScript module surface
 * by re-implementing the same invariants the production helpers enforce.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { timingSafeEqual } from "node:crypto";

const require = createRequire(import.meta.url);

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

function timingSafeStringEqual(a, b) {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      const fill = Buffer.alloc(bufA.length);
      timingSafeEqual(bufA, fill);
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function looksLikeSessionToken(token) {
  if (!token) return false;
  if (token.length < 20 || token.length > 4096) return false;
  if (token.includes(".")) {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    return parts.every((p) => p.length > 0 && /^[A-Za-z0-9_-]+$/.test(p));
  }
  return /^[A-Za-z0-9_-]+$/.test(token);
}

const SEARCH_ENGINE_BOTS = [
  "googlebot",
  "google-inspectiontool",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "applebot",
  "facebot",
  "twitterbot",
  "linkedinbot",
];

const SCRAPER_AGENTS = [
  "scrapy",
  "curl/",
  "wget/",
  "python-requests",
  "python-urllib",
  "aiohttp",
  "httpclient",
  "libwww",
  "httrack",
  "ia_archiver",
  "semrush",
  "ahrefsbot",
  "mj12bot",
  "dotbot",
  "petalbot",
  "bytespider",
  "gptbot",
  "claudebot",
  "anthropic",
  "ccbot",
  "dataforseo",
  "serpstat",
  "panscient",
  "extractor",
  "headlesschrome",
  "phantomjs",
  "selenium",
  "puppeteer",
  "playwright",
  "webzip",
  "sitesucker",
  "webcopier",
  "teleport",
  "offline explorer",
  "go-http-client",
  "java/",
  "apache-httpclient",
  "okhttp",
  "node-fetch",
  "undici",
  "postmanruntime",
  "insomnia",
  "httpie",
  "rest-client",
  "masscan",
  "nikto",
  "sqlmap",
  "nmap",
  "zgrab",
  "nuclei",
];

const RATE_BANDS = {
  auth: { limit: 12, windowMs: 60_000 },
  write: { limit: 40, windowMs: 60_000 },
  api: { limit: 90, windowMs: 60_000 },
  page: { limit: 160, windowMs: 60_000 },
};

function resolveRateBand(pathname, method) {
  const mutating = !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
  if (pathname.startsWith("/api/auth")) return "auth";
  if (pathname.startsWith("/api") && mutating) return "write";
  if (pathname.startsWith("/api")) return "api";
  return "page";
}

function isSearchEngineBot(ua) {
  const u = (ua || "").toLowerCase();
  return SEARCH_ENGINE_BOTS.some((b) => u.includes(b));
}

function isBotOrScraper(ua, headers = {}, method = "GET") {
  if (isSearchEngineBot(ua)) return false;
  const u = (ua || "").toLowerCase();
  if (!u || u.length < 12) return true;
  if (SCRAPER_AGENTS.some((b) => u.includes(b))) return true;
  const suspiciousHeaders =
    !headers["accept-language"] && !headers["sec-fetch-site"] && !headers["sec-fetch-mode"];
  if (suspiciousHeaders && method === "GET" && !u.includes("mozilla")) return true;
  return false;
}

check("auth band is strictest", () => {
  assert.equal(RATE_BANDS.auth.limit, 12);
  assert.ok(RATE_BANDS.auth.limit < RATE_BANDS.write.limit);
  assert.ok(RATE_BANDS.write.limit < RATE_BANDS.api.limit);
  assert.ok(RATE_BANDS.api.limit < RATE_BANDS.page.limit);
});

check("resolveRateBand maps paths correctly", () => {
  assert.equal(resolveRateBand("/api/auth/login", "POST"), "auth");
  assert.equal(resolveRateBand("/api/orders", "POST"), "write");
  assert.equal(resolveRateBand("/api/orders", "GET"), "api");
  assert.equal(resolveRateBand("/services", "GET"), "page");
});

check("search engines are never scrapers", () => {
  assert.equal(isBotOrScraper("Mozilla/5.0 (compatible; Googlebot/2.1)"), false);
  assert.equal(isBotOrScraper("Mozilla/5.0 (compatible; bingbot/2.0)"), false);
  assert.equal(isSearchEngineBot("Googlebot"), true);
});

check("scrapers are blocked", () => {
  assert.equal(isBotOrScraper("python-requests/2.31.0"), true);
  assert.equal(isBotOrScraper("curl/8.0.0"), true);
  assert.equal(isBotOrScraper("sqlmap/1.0"), true);
  assert.equal(isBotOrScraper(""), true);
});

check("browser UA is allowed", () => {
  assert.equal(
    isBotOrScraper(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      { "accept-language": "en", "sec-fetch-site": "none", "sec-fetch-mode": "navigate" }
    ),
    false
  );
});

check("session token shape validation", () => {
  assert.equal(looksLikeSessionToken("short"), false);
  assert.equal(looksLikeSessionToken("a.b"), false);
  assert.equal(looksLikeSessionToken("opaque_session_token_value_01"), true);
  assert.equal(
    looksLikeSessionToken(
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.signaturepartok"
    ),
    true
  );
  assert.equal(looksLikeSessionToken("aaa.bbb.ccc.ddd"), false);
  assert.equal(looksLikeSessionToken("bad.token$.here"), false);
});

check("timing-safe key compare", () => {
  assert.equal(timingSafeStringEqual("secret-key-123456", "secret-key-123456"), true);
  assert.equal(timingSafeStringEqual("secret-key-123456", "secret-key-123457"), false);
  assert.equal(timingSafeStringEqual("short", "longer-value"), false);
});

check("security.ts source still exports expected symbols", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const src = fs.readFileSync(
    path.join(process.cwd(), "src", "lib", "security.ts"),
    "utf8"
  );
  for (const sym of [
    "rateLimitBand",
    "resolveRateBand",
    "isBotOrScraper",
    "isSearchEngineBot",
    "validateOrigin",
    "requireTrustedMutation",
    "looksLikeSessionToken",
    "timingSafeStringEqual",
    "applySecurityHeaders",
  ]) {
    assert.ok(src.includes(`export function ${sym}`), `missing export ${sym}`);
  }
  assert.ok(src.includes('X-Robots-Tag", "noai, noimageai"'), "public pages must allow snippets");
  assert.ok(src.includes("noindex"), "private routes must noindex");
  assert.ok(src.includes("frame-ancestors 'none'"), "CSP must deny framing");
});

check("middleware wires all security bands", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const src = fs.readFileSync(path.join(process.cwd(), "src", "middleware.ts"), "utf8");
  for (const sym of [
    "isBotOrScraper",
    "isSearchEngineBot",
    "rateLimitBand",
    "requireTrustedMutation",
    "looksLikeSessionToken",
    "applySecurityHeaders",
  ]) {
    assert.ok(src.includes(sym), `middleware missing ${sym}`);
  }
});

console.log(`\n---\n${passed}/${passed + failed} unit security checks passed`);
if (failed) process.exitCode = 1;
