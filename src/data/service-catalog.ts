export type CatalogService = {
  id: string;
  name: string;
  category: string;
  description: string;
  limits: string;
  basePriceKes: number;
  unit: string;
  typicalTimeline: string;
  tags: string[];
};

/** TechFlare billable services & items — base prices in KES before demand multiplier. */
export const SERVICE_CATALOG: CatalogService[] = [
  {
    id: "frontend-simple",
    name: "Simple frontend",
    category: "Web Development",
    description: "Clean single-page or light multi-section frontend — brand intro, CTA, contact.",
    limits: "Up to 4 sections, basic animations, 1 revision round.",
    basePriceKes: 3000,
    unit: "project",
    typicalTimeline: "1–2 days",
    tags: ["frontend", "simple", "landing", "website", "3k"],
  },
  {
    id: "frontend-occasion",
    name: "Occasion frontend",
    category: "Web Development",
    description: "Celebration / occasion site — birthday, wedding, event invite with gallery and message.",
    limits: "Up to 6 sections, photo gallery, music optional, 1 revision round.",
    basePriceKes: 5000,
    unit: "project",
    typicalTimeline: "2–3 days",
    tags: ["frontend", "occasion", "birthday", "wedding", "event", "5k"],
  },
  {
    id: "web-simple",
    name: "Simple website (landing / brochure)",
    category: "Web Development",
    description: "Small multi-section marketing site with photos, messaging, and basic motion.",
    limits: "Up to 5 pages, 10 images, no user accounts, 1 revision round.",
    basePriceKes: 8000,
    unit: "project",
    typicalTimeline: "3–5 days",
    tags: ["website", "landing", "portfolio", "simple"],
  },
  {
    id: "web-custom",
    name: "Custom business website",
    category: "Web Development",
    description: "Responsive site with contact forms, service pages, and brand styling.",
    limits: "Up to 12 pages, CMS-ready structure, 2 revision rounds.",
    basePriceKes: 35000,
    unit: "project",
    typicalTimeline: "1–2 weeks",
    tags: ["website", "business", "corporate"],
  },
  {
    id: "web-ecommerce",
    name: "E-commerce / online shop",
    category: "Web Development",
    description: "Product catalog, cart, M-Pesa checkout integration.",
    limits: "Up to 50 products at launch, 1 payment gateway, 2 revision rounds.",
    basePriceKes: 85000,
    unit: "project",
    typicalTimeline: "3–4 weeks",
    tags: ["shop", "ecommerce", "store"],
  },
  {
    id: "pos-setup",
    name: "TechFlare POS setup",
    category: "Products",
    description: "Point-of-sale onboarding — catalog, checkout, receipts, staff roles.",
    limits: "1 outlet at launch, training session, 14-day support.",
    basePriceKes: 45000,
    unit: "setup",
    typicalTimeline: "1–2 weeks",
    tags: ["pos", "point of sale", "retail", "mpesa"],
  },
  {
    id: "deploy-hosting",
    name: "Deployment & hosting setup",
    category: "Cloud & DevOps",
    description: "Deploy to Vercel/Render, domain DNS, SSL, basic monitoring.",
    limits: "1 environment, handover documentation, 30-day setup support.",
    basePriceKes: 1000,
    unit: "deployment",
    typicalTimeline: "24 hours",
    tags: ["deploy", "hosting", "vercel", "domain", "ssl"],
  },
  {
    id: "mpesa-integration",
    name: "M-Pesa Daraja integration",
    category: "Payments",
    description: "STK Push, QR pay, till/C2B webhooks, invoice matching.",
    limits: "1 till or paybill, sandbox + production go-live support.",
    basePriceKes: 15000,
    unit: "integration",
    typicalTimeline: "3–5 days",
    tags: ["mpesa", "payment", "daraja", "stk"],
  },
  {
    id: "ui-ux-design",
    name: "UI/UX design package",
    category: "Design",
    description: "Wireframes, mockups, and design system for web or mobile.",
    limits: "Up to 8 screens, 1 revision round, Figma handoff.",
    basePriceKes: 12000,
    unit: "package",
    typicalTimeline: "4–6 days",
    tags: ["design", "ui", "ux", "figma"],
  },
  {
    id: "ai-chatbot",
    name: "AI assistant / chatbot",
    category: "AI Solutions",
    description: "Site or portal chatbot trained on your FAQs and services.",
    limits: "Up to 500 knowledge chunks, 1 channel (web), monthly tune-up not included.",
    basePriceKes: 25000,
    unit: "bot",
    typicalTimeline: "1 week",
    tags: ["ai", "chatbot", "assistant", "automation"],
  },
  {
    id: "automation-workflow",
    name: "Business process automation",
    category: "AI Solutions",
    description: "Automate repetitive ops — forms, alerts, approvals, and notifications.",
    limits: "Up to 3 workflows, 1 integration channel, documentation.",
    basePriceKes: 40000,
    unit: "project",
    typicalTimeline: "1–2 weeks",
    tags: ["automation", "workflow", "ops", "idea"],
  },
  {
    id: "mobile-app-mvp",
    name: "Mobile app MVP",
    category: "Software Engineering",
    description: "Cross-platform or Android MVP with core flows.",
    limits: "Up to 6 screens, 1 API backend, app store prep guidance.",
    basePriceKes: 120000,
    unit: "project",
    typicalTimeline: "4–6 weeks",
    tags: ["mobile", "app", "android", "ios", "software"],
  },
  {
    id: "api-backend",
    name: "API / backend development",
    category: "Software Engineering",
    description: "REST API, database, auth, admin endpoints.",
    limits: "Up to 15 endpoints, PostgreSQL/MySQL, documentation.",
    basePriceKes: 45000,
    unit: "project",
    typicalTimeline: "2–3 weeks",
    tags: ["api", "backend", "database", "software"],
  },
  {
    id: "research-sprint",
    name: "Research & feasibility sprint",
    category: "Research",
    description: "Problem research, market scan, and technical feasibility memo.",
    limits: "1 problem space, written report, 1 review call.",
    basePriceKes: 20000,
    unit: "sprint",
    typicalTimeline: "5–7 days",
    tags: ["research", "feasibility", "idea", "r&d"],
  },
  {
    id: "cyber-audit-basic",
    name: "Cybersecurity review (basic)",
    category: "Cyber Security",
    description: "Vulnerability scan, config review, written report.",
    limits: "1 web app or server, remote only, summary report.",
    basePriceKes: 18000,
    unit: "audit",
    typicalTimeline: "3–5 days",
    tags: ["security", "audit", "cyber"],
  },
  {
    id: "cloud-migration",
    name: "Cloud setup & migration",
    category: "Cloud & DevOps",
    description: "AWS/Azure/GCP or managed hosting migration plan + execution.",
    limits: "1 workload, rollback plan, 14-day hypercare.",
    basePriceKes: 55000,
    unit: "migration",
    typicalTimeline: "1–2 weeks",
    tags: ["cloud", "aws", "migration", "devops", "technology"],
  },
  {
    id: "iot-prototype",
    name: "IoT prototype",
    category: "IoT",
    description: "Sensor integration, dashboard, alert rules.",
    limits: "Up to 3 device types, 1 dashboard, pilot deployment.",
    basePriceKes: 75000,
    unit: "prototype",
    typicalTimeline: "2–3 weeks",
    tags: ["iot", "sensor", "hardware", "automation"],
  },
  {
    id: "content-media",
    name: "Media & content (photos / slider / audio)",
    category: "Creative",
    description: "Photo slider, embedded audio/song, gallery sections.",
    limits: "Up to 20 assets, compression & optimization included.",
    basePriceKes: 3000,
    unit: "package",
    typicalTimeline: "1–2 days",
    tags: ["photos", "slider", "song", "audio", "gallery"],
  },
  {
    id: "maintenance-monthly",
    name: "Monthly maintenance & support",
    category: "Support",
    description: "Updates, backups, minor fixes, uptime monitoring.",
    limits: "4 hours/month, business hours, excludes new features.",
    basePriceKes: 8000,
    unit: "month",
    typicalTimeline: "ongoing",
    tags: ["support", "maintenance", "retainer"],
  },
  {
    id: "consulting-hour",
    name: "Technical consulting",
    category: "Consulting",
    description: "Architecture, scoping, or code review session.",
    limits: "1 hour video call + written summary.",
    basePriceKes: 5000,
    unit: "hour",
    typicalTimeline: "scheduled",
    tags: ["consulting", "advice", "review", "technology"],
  },
];

export function getCatalogService(id: string) {
  return SERVICE_CATALOG.find((s) => s.id === id);
}

export function searchCatalog(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return SERVICE_CATALOG;
  return SERVICE_CATALOG.filter((s) => {
    const hay = [s.name, s.category, s.description, s.limits, ...s.tags, String(s.basePriceKes)]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}
