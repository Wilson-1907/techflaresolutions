import {
  company,
  accountVsCommunity,
  services,
  industries,
  products,
  innovationWorkflow,
  navLinks,
} from "@/data/site";

export const AI_SYSTEM_PROMPT = `You are TechFlare Solutions AI assistant — helpful, warm, and professional.
Company: ${company.name} — "${company.tagline}". ${company.subtagline}.
Mission: ${company.mission}
Brand: ${company.brandStatement}
Character: Lion resilience, gold loyalty (we treat everyone like kings and queens), deep blue trust, white purity and integrity.

Always use the full company name "${company.name}" — never shorten to TechFlare alone.
Always answer using facts from the ${company.name} website. Guide users to the right page when relevant.
Contact: ${company.email}, phone ${company.phone} (WhatsApp ${company.phoneLocal}).
Offices: ${company.offices.map((o) => o.city).join(" & ")}, ${company.country}.
Community WhatsApp: ${company.communityWhatsApp}

Key rules:
- Browsing is free; sign-in required for Solutions Center AI proposals, Innovation Hub submissions, AI tools, and portals.
- Product orders (e.g. voting system) do NOT require login — use /products.
- Account sign-up and WhatsApp community membership are separate.
- Careers require community membership.
- Clients earn points (${company.pointsRate * 100}% of profit value on qualifying projects).`;

export const knowledgeTopics: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["service", "offer", "what do you do", "help with"],
    answer: `TechFlare Solutions offers: ${services.map((s) => s.title).join(", ")}. Visit /services for details. We take you from research and innovation through engineering to deployment.`,
  },
  {
    keywords: ["innovation hub", "innovation", "hub", "submit idea", "invention"],
    answer: `The Innovation Hub at /innovation-hub is our centerpiece. Submit ideas, inventions, or business concepts. Our pipeline: ${innovationWorkflow.map((w) => w.title).join(" → ")}. Sign-in required to submit. Track progress at /portal/innovation.`,
  },
  {
    keywords: ["idea", "submit", "proposal"],
    answer:
      "Submit ideas at /innovation-hub (account required). For business problems needing a solution plan, use /solutions — our AI proposal generator helps after you sign in.",
  },
  {
    keywords: ["industr", "sector", "education", "healthcare", "agriculture", "government"],
    answer: `We serve: ${industries.map((i) => i.title).join(", ")}. Each has tailored solutions — explore /industries.`,
  },
  {
    keywords: ["product", "voting", "biometric", "attendance", "exam", "order", "buy", "purchase"],
    answer: `Built-in products (order without login): ${products.map((p) => p.title).join("; ")}. View details, pricing, and terms at /products — click a product to order via email to ${company.solutionsEmail}.`,
  },
  {
    keywords: ["voting system", "blockchain voting", "election"],
    answer:
      "Our Blockchain Voting Platform offers tamper-proof elections with voter authentication, real-time results, and audit trails. See /products/blockchain-voting — you can order directly without an account; we'll help you draft the request email.",
  },
  {
    keywords: ["solution", "problem", "solve", "proposal", "ai proposal"],
    answer:
      "Visit /solutions to describe your problem. After signing in, use our AI proposal generator for a preliminary plan. Our team follows up within 48 hours.",
  },
  {
    keywords: ["contact", "email", "phone", "whatsapp", "call", "reach"],
    answer: `Contact TechFlare Solutions: ${company.email}, phone ${company.phone}, WhatsApp ${company.phoneLocal}. Offices in ${company.offices.map((o) => o.city).join(" and ")}, Kenya. Online and physical — /contact.`,
  },
  {
    keywords: ["community", "whatsapp group", "join group"],
    answer: `${accountVsCommunity.communityDescription} Join via ${company.communityWhatsApp}. Share your email in the group for notifications. Confirm at /community (requires account).`,
  },
  {
    keywords: ["account", "register", "sign up", "signup", "login", "sign in", "portal"],
    answer: `${accountVsCommunity.accountDescription} Register at /register. Client portal: /portal/client. Innovation portal: /portal/innovation. Admin is internal.`,
  },
  {
    keywords: ["career", "job", "intern", "hire", "work with"],
    answer:
      "Careers are at /careers. You must be a member of our WhatsApp community to apply. Join the community first, then apply with your community membership confirmed.",
  },
  {
    keywords: ["point", "reward", "discount", "client benefit"],
    answer: company.pointsDescription,
  },
  {
    keywords: ["about", "mission", "vision", "who are you", "techflare", "brand", "lion", "gold", "blue", "white", "character"],
    answer: `${company.name}: ${company.tagline}. ${company.mission} Brand character (lion resilience, gold loyalty, deep blue trust, white purity) is featured on our homepage. Company story: /about.`,
  },
  {
    keywords: ["research", "white paper", "case study", "report"],
    answer: "Our Research Center at /research publishes white papers, case studies, industry reports, and innovation reports.",
  },
  {
    keywords: ["news", "announcement", "press", "newsroom"],
    answer: "Company news, awards, and announcements are at /newsroom.",
  },
  {
    keywords: ["career", "community member"],
    answer: accountVsCommunity.communitySteps.join(" → "),
  },
  {
    keywords: ["page", "navigate", "where", "find"],
    answer: `Main pages: ${navLinks.map((l) => `${l.label} (${l.href})`).join(", ")}.`,
  },
  {
    keywords: ["success", "worked", "helpful", "thank", "yes i did", "got it"],
    answer:
      "That's great to hear! If you need anything else — another idea, a product order, or a custom solution — I'm here. You can also reach us at " +
      company.email +
      ".",
  },
  {
    keywords: ["no", "not yet", "still need", "didn't work", "failed", "confused"],
    answer:
      "No worries — let's keep going. Tell me what step you're stuck on, or contact our team directly at " +
      company.email +
      " or WhatsApp " +
      company.phoneLocal +
      ". For hands-on help with solutions, visit /solutions or /contact.",
  },
];

export function matchKnowledge(message: string): string | null {
  const lower = message.toLowerCase().trim();
  let best: { score: number; answer: string } | null = null;

  for (const topic of knowledgeTopics) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (lower.includes(kw)) score += kw.length;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: topic.answer };
    }
  }

  return best?.answer ?? null;
}

export function buildFollowUpMessage(exactPreviousQuestion: string): string {
  return `Hello again! You previously asked: "${exactPreviousQuestion}" — were you successful with that, or do you still need help?`;
}

export function buildFollowUpNotificationBody(exactPreviousQuestion: string): string {
  const short =
    exactPreviousQuestion.length > 80
      ? `${exactPreviousQuestion.slice(0, 77)}...`
      : exactPreviousQuestion;
  return `Follow-up: Were you successful with "${short}"? Tap to reply.`;
}
