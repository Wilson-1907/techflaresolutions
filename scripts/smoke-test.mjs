#!/usr/bin/env node
/**
 * Smoke test all public pages and API routes.
 * Run after: npm run build && npm run start
 */

const BASE = process.env.TEST_BASE || "http://localhost:3000";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const pages = [
  "/",
  "/about",
  "/accessibility",
  "/careers",
  "/community",
  "/contact",
  "/industries",
  "/industries/education",
  "/industries/healthcare",
  "/industries/agriculture",
  "/industries/government",
  "/industries/finance",
  "/industries/logistics",
  "/industries/manufacturing",
  "/innovation-hub",
  "/investor-relations",
  "/login",
  "/newsroom",
  "/privacy",
  "/products",
  "/products/career-compass-cbe",
  "/products/biometric-voting-system",
  "/products/biometric-class-attendance",
  "/register",
  "/research",
  "/services",
  "/solutions",
  "/terms",
  "/portal/client",
  "/portal/client/projects",
  "/portal/client/invoices",
  "/portal/admin",
  "/portal/admin/crm",
  "/portal/admin/settings",
  "/portal/innovation",
  "/portal/innovation/submit",
  "/portal/innovation/tracking",
  "/portal/employee",
  "/pay",
];

async function fetchPath(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "User-Agent": UA,
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/json",
      ...(options.headers || {}),
    },
    redirect: "manual",
  });
  return { path, status: res.status, ok: res.ok || res.status === 307 || res.status === 308 };
}

async function main() {
  console.log(`Testing ${BASE}\n`);
  const results = [];

  for (const path of pages) {
    try {
      const r = await fetchPath(path);
      results.push(r);
      const mark = r.status >= 200 && r.status < 400 ? "OK" : "FAIL";
      console.log(`[${mark}] ${r.status} ${path}`);
    } catch (e) {
      results.push({ path, status: 0, ok: false, error: String(e) });
      console.log(`[FAIL] --- ${path} (${e.message})`);
    }
  }

  console.log("\n--- API routes ---\n");

  const apiTests = [
    { name: "GET /api/stats", fn: () => fetchPath("/api/stats", { headers: { Accept: "application/json" } }) },
    {
      name: "POST /api/ai/chat",
      fn: () =>
        fetch(`${BASE}/api/ai/chat`, {
          method: "POST",
          headers: { "User-Agent": UA, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ message: "What services do you offer?" }),
        }).then((r) => ({ path: "/api/ai/chat", status: r.status, ok: r.ok })),
    },
    {
      name: "POST /api/auth/login (demo)",
      fn: async () => {
        const r = await fetch(`${BASE}/api/auth/login`, {
          method: "POST",
          headers: { "User-Agent": UA, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email: "client@example.com", password: "client123" }),
        });
        return { path: "/api/auth/login", status: r.status, ok: r.ok };
      },
    },
    {
      name: "GET /api/auth/me (no auth)",
      fn: async () => {
        const r = await fetch(`${BASE}/api/auth/me`, {
          headers: { "User-Agent": UA, Accept: "application/json" },
        });
        return { path: "/api/auth/me", status: r.status, ok: r.status === 401 };
      },
    },
    {
      name: "POST /api/products/order (validation)",
      fn: async () => {
        const r = await fetch(`${BASE}/api/products/order`, {
          method: "POST",
          headers: { "User-Agent": UA, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ productSlug: "career-compass-cbe" }),
        });
        return { path: "/api/products/order", status: r.status, ok: r.status === 400 || r.status === 401 || r.ok };
      },
    },
  ];

  for (const test of apiTests) {
    try {
      const r = await test.fn();
      const mark = r.ok ? "OK" : "FAIL";
      console.log(`[${mark}] ${r.status} ${test.name}`);
      results.push(r);
    } catch (e) {
      console.log(`[FAIL] --- ${test.name} (${e.message})`);
      results.push({ ok: false });
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n--- Summary: ${results.length - failed.length}/${results.length} passed ---`);
  if (failed.length) process.exit(1);
}

main();
