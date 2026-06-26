const PATH_LABELS: Record<string, string> = {
  "/": "Home page. TechFlare Solutions — IGNITING INNOVATIONS, DELIVERING SOLUTIONS.",
  "/about": "About TechFlare Solutions.",
  "/services": "Our services — research, engineering, AI, and deployment.",
  "/industries": "Industries we serve.",
  "/products": "TechFlare products.",
  "/innovation-hub": "Innovation Hub — submit and track ideas.",
  "/solutions": "Solutions Center — describe your business problem.",
  "/research": "Research Center.",
  "/careers": "Careers at TechFlare.",
  "/blog": "Innovation blog.",
  "/newsroom": "Company newsroom.",
  "/community": "WhatsApp community membership.",
  "/contact": "Contact TechFlare.",
  "/login": "Sign in to your account.",
  "/register": "Create a new account.",
  "/verify-email": "Verify your email with the one-time code.",
  "/forgot-password": "Reset your password.",
  "/terms": "Terms and payment policy.",
  "/privacy": "Privacy policy.",
  "/accessibility": "Accessibility settings and information.",
  "/pay": "Invoice payment with M-Pesa.",
  "/portal/client": "Client portal dashboard.",
  "/portal/client/submit": "Submit a client project or solution request.",
  "/portal/client/invoices": "Your invoices — view and pay with M-Pesa.",
  "/portal/client/payments": "Payment history and M-Pesa receipts.",
  "/portal/client/points": "Your loyalty reward points.",
  "/portal/innovation": "Innovation portal dashboard.",
  "/portal/innovation/submit": "Submit your innovation or idea.",
  "/portal/innovation/tracking": "Track your innovation submissions.",
  "/portal/employee": "Employee portal.",
};

export function getPathAnnouncement(pathname: string): string {
  if (PATH_LABELS[pathname]) return `Now on ${PATH_LABELS[pathname]}`;

  for (const [path, label] of Object.entries(PATH_LABELS)) {
    if (path !== "/" && pathname.startsWith(path)) {
      return `Now on ${label}`;
    }
  }

  const title = typeof document !== "undefined" ? document.title.replace(/\s*\|.*$/, "").trim() : "";
  return title ? `Now on ${title}.` : "Page loaded.";
}

export function readPageSummary(): string {
  const main = document.getElementById("main-content");
  if (!main) return "Main content is not available on this page.";

  const heading = main.querySelector("h1")?.textContent?.trim();
  const intro =
    main.querySelector("p")?.textContent?.trim() ||
    main.querySelector('[class*="subtitle"]')?.textContent?.trim();

  const parts: string[] = [];
  if (heading) parts.push(heading);
  if (intro) parts.push(intro.slice(0, 280));

  return parts.length > 0 ? parts.join(". ") : "This page is ready. Tab through links and buttons to explore.";
}
