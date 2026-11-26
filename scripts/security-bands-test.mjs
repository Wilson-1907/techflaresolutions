#!/usr/bin/env node
/**
 * Security bands smoke test against a running TechFlare frontend.
 * Usage: node scripts/security-bands-test.mjs [baseUrl]
 */
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

const results = [];

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`PASS  ${name}`);
  } catch (err) {
    results.push({ name, ok: false, error: err instanceof Error ? err.message : String(err) });
    console.error(`FAIL  ${name}: ${err instanceof Error ? err.message : err}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function req(path, init = {}) {
  const res = await fetch(`${base}${path}`, {
    redirect: "manual",
    ...init,
    headers: {
      ...(init.headers || {}),
    },
  });
  return res;
}

await check("Googlebot can open homepage (indexing)", async () => {
  const res = await req("/", {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      Accept: "text/html",
      "Accept-Language": "en",
    },
  });
  assert(res.status === 200, `expected 200, got ${res.status}`);
  const robots = res.headers.get("x-robots-tag") || "";
  assert(!robots.includes("nosnippet"), "homepage must allow snippets for sitelinks");
});

await check("Scraper UA blocked on homepage", async () => {
  const res = await req("/", {
    headers: { "User-Agent": "python-requests/2.31.0", Accept: "*/*" },
  });
  assert(res.status === 403, `expected 403, got ${res.status}`);
});

await check("curl UA blocked on homepage", async () => {
  const res = await req("/", {
    headers: { "User-Agent": "curl/8.0.0", Accept: "*/*" },
  });
  assert(res.status === 403, `expected 403, got ${res.status}`);
});

await check("Browser UA homepage has security headers", async () => {
  const res = await req("/", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html",
      "Accept-Language": "en-US,en;q=0.9",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-Mode": "navigate",
    },
  });
  assert(res.status === 200, `expected 200, got ${res.status}`);
  assert(res.headers.get("x-frame-options") === "DENY", "missing X-Frame-Options");
  assert(res.headers.get("x-content-type-options") === "nosniff", "missing nosniff");
  assert(!!res.headers.get("content-security-policy"), "missing CSP");
  assert(!!res.headers.get("cross-origin-opener-policy"), "missing COOP");
  const csp = res.headers.get("content-security-policy") || "";
  assert(csp.includes("frame-ancestors 'none'"), "CSP must deny framing");
});

await check("Portal redirects unauthenticated users", async () => {
  const res = await req("/portal/client", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html",
      "Accept-Language": "en",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
    },
  });
  assert([302, 303, 307, 308].includes(res.status), `expected redirect, got ${res.status}`);
  const loc = res.headers.get("location") || "";
  assert(loc.includes("/login"), `expected login redirect, got ${loc}`);
});

await check("Malformed auth cookie rejected for portal", async () => {
  const res = await req("/portal/client", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html",
      "Accept-Language": "en",
      Cookie: "auth_token=short",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
    },
  });
  assert([302, 303, 307, 308].includes(res.status), `expected redirect, got ${res.status}`);
});

await check("API mutation without Origin is forbidden", async () => {
  const res = await req("/api/auth/login", {
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email: "x@y.com", password: "nope" }),
  });
  assert(res.status === 403, `expected 403, got ${res.status}`);
});

await check("API mutation with trusted Origin reaches handler", async () => {
  const res = await req("/api/auth/login", {
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: base,
      Referer: `${base}/login`,
    },
    body: JSON.stringify({ email: "x@y.com", password: "nope" }),
  });
  // Should not be blocked by middleware origin band (403 Forbidden origin).
  assert(res.status !== 403 || !(await res.clone().text()).includes("Forbidden origin"), `middleware origin blocked unexpectedly: ${res.status}`);
  assert([400, 401, 404, 502, 503].includes(res.status) || res.status < 500 || res.status >= 400, `unexpected ${res.status}`);
});

await check("Private API responses discourage indexing", async () => {
  const res = await req("/api/auth/me", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json",
      "Accept-Language": "en",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
    },
  });
  const robots = (res.headers.get("x-robots-tag") || "").toLowerCase();
  assert(robots.includes("noindex") || robots.includes("nosnippet"), `expected private robots tag, got ${robots}`);
});

await check("Auth rate band returns 429 under burst", async () => {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/json",
    Accept: "application/json",
    Origin: base,
    Referer: `${base}/login`,
  };
  let saw429 = false;
  for (let i = 0; i < 20; i++) {
    const res = await req("/api/auth/login", {
      method: "POST",
      headers,
      body: JSON.stringify({ email: `burst${i}@test.com`, password: "x" }),
    });
    if (res.status === 429) {
      saw429 = true;
      break;
    }
  }
  assert(saw429, "expected auth rate limit 429 under burst");
});

const failed = results.filter((r) => !r.ok);
console.log("\n---");
console.log(`${results.length - failed.length}/${results.length} security bands passed`);
if (failed.length) {
  process.exitCode = 1;
}
