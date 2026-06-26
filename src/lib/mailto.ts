import { company, services, products, industries } from "@/data/site";

export type MailtoContext =
  | { type: "contact" }
  | { type: "service"; service: string }
  | { type: "product"; product: string; plan?: string }
  | { type: "payment"; invoice?: string; amount?: string }
  | { type: "solutions" }
  | { type: "innovation" }
  | { type: "industry"; industry: string }
  | { type: "investor" }
  | { type: "careers"; role?: string }
  | { type: "support"; topic?: string }
  | { type: "order"; product: string; plan?: string }
  | { type: "revision"; project?: string }
  | { type: "general"; label: string };

const PREFIX = "TechFlare";

export function buildMailtoSubject(context: MailtoContext): string {
  switch (context.type) {
    case "contact":
      return `${PREFIX} — General inquiry`;
    case "service":
      return `${PREFIX} — ${context.service} inquiry`;
    case "product":
      return `${PREFIX} — ${context.product}${context.plan ? ` (${context.plan})` : ""}`;
    case "order":
      return `${PREFIX} — Order: ${context.product}${context.plan ? ` (${context.plan})` : ""}`;
    case "payment":
      return context.invoice
        ? `${PREFIX} — Payment for Invoice ${context.invoice}${context.amount ? ` (${context.amount})` : ""}`
        : `${PREFIX} — Payment inquiry`;
    case "solutions":
      return `${PREFIX} — Solutions Center request`;
    case "innovation":
      return `${PREFIX} — Innovation Hub inquiry`;
    case "industry":
      return `${PREFIX} — ${context.industry} sector inquiry`;
    case "investor":
      return `${PREFIX} — Investor relations`;
    case "careers":
      return context.role ? `${PREFIX} — Career application: ${context.role}` : `${PREFIX} — Career inquiry`;
    case "support":
      return context.topic ? `${PREFIX} — Support: ${context.topic}` : `${PREFIX} — Portal support`;
    case "revision":
      return context.project
        ? `${PREFIX} — Revision request: ${context.project}`
        : `${PREFIX} — Revision request`;
    case "general":
      return `${PREFIX} — ${context.label}`;
    default:
      return `${PREFIX} — Inquiry`;
  }
}

/** Minimal body — client only types their message below the greeting */
export function buildMailtoBody(options?: {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  extraLines?: string[];
}): string {
  const lines = ["Hello TechFlare Solutions,", ""];

  if (options?.name) lines.push(`Name: ${options.name}`);
  if (options?.email) lines.push(`Reply-to email: ${options.email}`);
  if (options?.phone) lines.push(`Phone: ${options.phone}`);
  if (options?.organization) lines.push(`Organization: ${options.organization}`);

  if (options?.extraLines?.length) {
    if (lines.length > 2) lines.push("");
    lines.push(...options.extraLines);
    lines.push("");
  }

  lines.push("");

  return lines.join("\n");
}

export type EmailComposeOptions = {
  to?: string;
  subject?: string;
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  extraLines?: string[];
  body?: string;
};

function encodeMailParams(
  context: MailtoContext,
  options?: EmailComposeOptions
): { to: string; subject: string; body: string } {
  return {
    to: options?.to || company.email,
    subject: options?.subject ?? buildMailtoSubject(context),
    body: options?.body ?? buildMailtoBody(options),
  };
}

/** Standard mailto — opens default email app */
export function buildMailtoLink(context: MailtoContext, options?: EmailComposeOptions): string {
  const { to, subject, body } = encodeMailParams(context, options);
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Gmail web compose — subject & greeting ready; user types message and clicks Send */
export function buildGmailComposeLink(context: MailtoContext, options?: EmailComposeOptions): string {
  const { to, subject, body } = encodeMailParams(context, options);
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/** Opens the default email app with recipient, subject, and message */
export function buildEmailComposeLink(context: MailtoContext, options?: EmailComposeOptions): string {
  return buildMailtoLink(context, options);
}

export function parseContactContext(params: URLSearchParams): MailtoContext {
  const service = params.get("service");
  if (service) return { type: "service", service: decodeURIComponent(service) };

  const product = params.get("product");
  if (product) {
    const plan = params.get("plan");
    return { type: "product", product: decodeURIComponent(product), plan: plan || undefined };
  }

  const industry = params.get("industry");
  if (industry) return { type: "industry", industry: decodeURIComponent(industry) };

  const about = params.get("about");
  if (about === "solutions") return { type: "solutions" };
  if (about === "innovation") return { type: "innovation" };
  if (about === "investor") return { type: "investor" };
  if (about === "careers") return { type: "careers", role: params.get("role") || undefined };
  if (about === "payment") {
    return {
      type: "payment",
      invoice: params.get("invoice") || undefined,
      amount: params.get("amount") || undefined,
    };
  }

  const topic = params.get("topic");
  if (topic) return { type: "support", topic: decodeURIComponent(topic) };

  return { type: "contact" };
}

/** Infer email subject context from the page the user is on */
export function contextFromPath(
  pathname: string,
  searchParams?: URLSearchParams,
  hash?: string
): MailtoContext {
  if (searchParams) {
    const parsed = parseContactContext(searchParams);
    if (parsed.type !== "contact") return parsed;
  }

  const cleanHash = hash?.replace("#", "").trim();

  if (pathname.startsWith("/services")) {
    const svc = services.find((s) => s.slug === cleanHash);
    if (svc) return { type: "service", service: svc.title };
    return { type: "general", label: "Services inquiry" };
  }

  if (pathname.startsWith("/products/") && pathname !== "/products") {
    const slug = pathname.split("/").pop();
    const product = products.find((p) => p.slug === slug);
    if (product) return { type: "product", product: product.title };
  }
  if (pathname === "/products") return { type: "general", label: "Product inquiry" };

  if (pathname.startsWith("/industries/")) {
    const slug = pathname.split("/").pop();
    const industry = industries.find((i) => i.slug === slug);
    if (industry) return { type: "industry", industry: industry.title };
  }

  if (pathname === "/pay") return { type: "payment" };
  if (pathname === "/solutions") return { type: "solutions" };
  if (pathname === "/innovation-hub") return { type: "innovation" };
  if (pathname === "/careers") return { type: "careers" };
  if (pathname === "/investor-relations") return { type: "investor" };
  if (pathname.startsWith("/portal/client")) {
    const section = pathname.split("/").pop();
    if (section && section !== "client") {
      return { type: "support", topic: `Client portal — ${section}` };
    }
    return { type: "support", topic: "Client portal" };
  }
  if (pathname.startsWith("/portal/innovation")) {
    const section = pathname.split("/").pop();
    if (section && section !== "innovation") {
      return { type: "support", topic: `Innovation portal — ${section}` };
    }
    return { type: "innovation" };
  }
  if (pathname === "/terms") return { type: "general", label: "Terms & Conditions question" };

  return { type: "contact" };
}
