export const company = {
  name: "TechFlare Solutions",
  tagline: "IGNITING INNOVATIONS, DELIVERING SOLUTIONS",
  mission:
    "To bridge the gap between groundbreaking ideas and world-class technology solutions through rigorous research, innovative engineering, and relentless execution.",
  vision:
    "To become the global leader in idea-to-solution transformation, empowering innovators, businesses, and governments to solve humanity's most pressing challenges.",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "stechflare@gmail.com",
  solutionsEmail: process.env.NEXT_PUBLIC_SOLUTIONS_EMAIL || "stechflare@gmail.com",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE?.replace(/\s/g, "") || "+254117880494",
  phoneLocal: "+254117880494",
  whatsapp: "254117880494",
  whatsappLink: "https://wa.me/254117880494",
  communityWhatsApp: "https://chat.whatsapp.com/HaexOE7SYvMJBdjruVmDJo",
  social: {
    handle: "techflare_solutions",
    links: [
      {
        id: "instagram",
        name: "Instagram",
        handle: "techflare_solutions",
        href: "https://www.instagram.com/techflare_solutions/",
      },
      {
        id: "facebook",
        name: "Facebook",
        handle: "techflare_solutions",
        href: "https://www.facebook.com/techflare_solutions",
      },
      {
        id: "tiktok",
        name: "TikTok",
        handle: "techflare_solutions",
        href: "https://www.tiktok.com/@techflare_solutions",
      },
      { id: "x", name: "X", handle: "techflare_solutions", href: "https://x.com/techflare_solutions" },
      {
        id: "linkedin",
        name: "LinkedIn",
        handle: "techflare_solutions",
        href: "https://www.linkedin.com/company/techflare_solutions",
      },
      {
        id: "youtube",
        name: "YouTube",
        handle: "techflare_solutions",
        href: "https://www.youtube.com/@techflare_solutions",
      },
    ],
  },
  country: "Kenya",
  locationNote: "Kenya — Online & physical offices",
  offices: [
    { city: "Karatina", country: "Kenya", address: "TechFlare Solutions Office, Karatina" },
    { city: "Nyeri", country: "Kenya", address: "TechFlare Solutions Office, Nyeri" },
  ],
  pointsRate: 0.05,
  pointsDescription:
    "Registered clients earn TechFlare Points equal to 5% of profit value on qualifying projects. Redeem points for product discounts, awards, and exclusive benefits.",
  founded: "1 July 2026",
};

export const founder = {
  name: "Kinyanjui Wilson",
  role: "CEO & Founder · AI Engineer",
  image: "/kinyanjui-wilson.png",
  bio: "Founded TechFlare Solutions on 1 July 2026. AI Engineer based in Kenya.",
};

export const accountVsCommunity = {
  accountTitle: "Why you need an account",
  accountDescription:
    "Browsing TechFlare is open to everyone. A free account unlocks your private workspace — where projects, ideas, and support live securely with us.",
  accountReasons: [
    "Track proposals, projects, invoices, and payments in your client or innovator portal",
    "Submit ideas, business problems, and revision requests with full status updates",
    "Use AI-assisted tools in a signed-in session tailored to your work with us",
    "Earn TechFlare Points and access member-only features as a registered client",
  ],
  accountCta: "Get started",
  communityTitle: "Join Our Community",
  communityDescription:
    "Our community is separate from your website account. Join our WhatsApp group to receive notifications, share your email for activity updates, and access careers and innovation programs.",
  communitySteps: [
    "Create your TechFlare account (recommended for portal and points)",
    "Join our WhatsApp community via the official link",
    "Share your email in the group for notifications and event reminders",
    "Apply for careers and participate in community innovation activities",
  ],
};

export const coreValues = [
  { title: "Innovation First", description: "Every challenge is an opportunity to pioneer something extraordinary." },
  { title: "Research-Driven", description: "Decisions backed by data, analysis, and rigorous methodology." },
  { title: "Client Partnership", description: "We succeed only when our clients achieve transformative outcomes." },
  { title: "Integrity", description: "Transparency and ethical practices in every engagement." },
  { title: "Excellence", description: "World-class standards in every line of code and every deliverable." },
  { title: "Global Impact", description: "Technology that serves communities and advances humanity." },
];

export const logoSymbols = [
  {
    name: "Golden Lion",
    meaning:
      "Strength, leadership, and courage — representing our commitment to bold innovation and protecting the ideas we build.",
  },
  {
    name: "Globe",
    meaning:
      "Global reach and universal impact — technology that connects communities and serves humanity across borders.",
  },
  {
    name: "Circuit Lines",
    meaning:
      "Lines of code and digital connectivity — the engineering foundation that powers every solution we deliver.",
  },
  {
    name: "Gold Ring",
    meaning:
      "Excellence and premium quality — a standard of craftsmanship in every project, product, and partnership.",
  },
  {
    name: "Tagline — IGNITING INNOVATIONS, DELIVERING SOLUTIONS",
    meaning:
      "Our promise to spark bold ideas and ship dependable technology — from first concept through delivery.",
  },
];

export interface Service {
  slug: string;
  title: string;
  image: string;
  description: string;
  /** Step-by-step how TechFlare handles this service */
  approach: string[];
  /** Tools, frameworks, and platforms we use */
  tools: string[];
}

export const services: Service[] = [
  {
    slug: "innovation-consulting",
    title: "Innovation Consulting",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop",
    description: "Strategic guidance to transform ideas into viable products.",
    approach: [
      "Discovery session — we map your problem, audience, and constraints.",
      "Feasibility & research review within 24 working hours (Innovation Hub pipeline).",
      "Scope document with milestones, timelines, and success metrics.",
      "Partnership agreement and portal setup so you track every stage.",
      "Handoff to engineering or phased delivery based on agreed roadmap.",
    ],
    tools: ["Innovation Hub portal", "Workflow milestones", "Research frameworks", "Miro / workshops", "Agreed scope documents"],
  },
  {
    slug: "software-development",
    title: "Software Development",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80&auto=format&fit=crop",
    description: "Custom applications built with cutting-edge technologies.",
    approach: [
      "Requirements workshop and technical specification in your client portal.",
      "Agile sprints with visible progress bar and milestone schedules.",
      "Code review, automated checks, and QA before each delivery.",
      "Staging demo for your feedback; revisions requested through the portal.",
      "Production deployment with documentation and support handover.",
    ],
    tools: ["Next.js", "TypeScript", "React", "Node.js", "PostgreSQL", "Prisma", "GitHub", "Vercel / Render"],
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
    description: "Machine learning, NLP, and intelligent automation systems.",
    approach: [
      "Use-case audit — what should AI automate vs. what needs human review.",
      "Model & API selection (Groq, OpenAI, or custom) aligned to budget and latency.",
      "Prompt design and knowledge-base grounding on your official policies/data.",
      "Integration into your site, portal, or internal tools with guardrails.",
      "Testing, monitoring, and iteration based on real user questions.",
    ],
    tools: ["Groq / OpenAI APIs", "RAG knowledge bases", "TechFlare AI assistant", "Python", "Secure API gateways"],
  },
  {
    slug: "data-engineering",
    title: "Data Engineering",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
    description: "Pipelines, warehouses, and analytics infrastructure.",
    approach: [
      "Audit existing data sources, quality, and access patterns.",
      "Design pipelines for ingest, transform, and secure storage.",
      "Encrypt sensitive fields at rest; hash identifiers for lookup.",
      "Build dashboards or API endpoints your team can trust.",
      "Document lineage and hand over operational runbooks.",
    ],
    tools: ["PostgreSQL / Aiven", "ETL scripts", "AES-256 encryption", "Prisma", "Analytics APIs", "Portal reporting"],
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format&fit=crop",
    description: "AWS, Azure, and GCP architecture and migration.",
    approach: [
      "Infrastructure assessment and cost/security review.",
      "Architecture diagram — frontend, API, database, and environment split.",
      "CI/CD and environment variables documented per service.",
      "Migration with minimal downtime; CORS and SSL configured.",
      "Monitoring health endpoints and redeploy playbooks.",
    ],
    tools: ["Vercel", "Render", "Docker", "Aiven PostgreSQL", "AWS / GCP (when required)", "GitHub Actions"],
  },
  {
    slug: "internet-of-things",
    title: "Internet of Things (IoT)",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
    description: "Connected devices, sensors, edge gateways, and real-time monitoring platforms.",
    approach: [
      "Use-case workshop — what to sense, control, or automate on-site vs. in the cloud.",
      "Hardware selection (MCU, gateways, sensors) and secure device provisioning.",
      "Firmware, MQTT/HTTP protocols, and edge logic before cloud ingest.",
      "Dashboards, alerts, and APIs integrated with your portal or operations team.",
      "Pilot deployment, field testing, and handover with monitoring runbooks.",
    ],
    tools: ["ESP32 / Arduino / Raspberry Pi", "MQTT", "Edge gateways", "Timeseries DB", "Grafana", "Secure OTA updates"],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80&auto=format&fit=crop",
    description: "Threat assessment, compliance, and security architecture.",
    approach: [
      "Threat modeling for your app, data, and third-party integrations.",
      "Enforce HTTPS, secure cookies, rate limits, and origin validation.",
      "Hash passwords (bcrypt); encrypt PII and submissions at rest.",
      "API key separation for admin, finance, and public routes.",
      "Security review before launch; guidance on ongoing patches.",
    ],
    tools: ["AES-256-GCM", "bcrypt", "JWT", "CORS policies", "OWASP practices", "Rate limiting", "HTTPS / HSTS"],
  },
  {
    slug: "research-development",
    title: "Research & Development",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80&auto=format&fit=crop",
    description: "Applied research and prototype development.",
    approach: [
      "Literature and market scan for your idea or sector.",
      "Hypothesis, experiment plan, and prototype scope.",
      "Build proof-of-concept with measurable success criteria.",
      "Validate with stakeholders; publish findings in your portal.",
      "Transition to full product development when approved.",
    ],
    tools: ["Research Center", "Innovation Hub", "Prototyping stack", "Case studies", "White-paper templates"],
  },
  {
    slug: "product-development",
    title: "Product Development",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80&auto=format&fit=crop",
    description: "End-to-end product lifecycle from concept to launch.",
    approach: [
      "Concept validation and user-journey mapping.",
      "UX/UI design aligned with TechFlare brand and accessibility.",
      "Build MVP → beta → launch with client/innovator portal tracking.",
      "Payments, invoices, and finance office integration when needed.",
      "Post-launch support, ratings, and iteration from portal feedback.",
    ],
    tools: ["Full-stack web apps", "Client & innovator portals", "Finance / invoicing", "M-Pesa integration", "Schedule progress tracking"],
  },
];

export { industries } from "./industries";

export type ProductStatus = "live" | "in-development" | "coming-soon";

export interface Product {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  image?: string;
  externalUrl?: string;
  features: string[];
  howItWorks?: string[];
  pricing?: { starter?: number | string; professional?: number | string; enterprise?: number | string };
  source?: "techflare" | "innovator";
  innovatorName?: string;
}

export const productStatusLabels: Record<ProductStatus, string> = {
  live: "Ready",
  "in-development": "In the Fire",
  "coming-soon": "Coming",
};

export const products: Product[] = [
  {
    slug: "career-compass-cbe",
    title: "Career Compass",
    tagline: "AI-Powered CBE Career Guide for Kenyan Students",
    description:
      "Career Compass helps students navigate Kenya's Competency-Based Education system with confidence. Built by TechFlare Solutions, it uses AI to analyze interests, skills, and aspirations — delivering personalized career pathway recommendations, expert counseling connections, and interactive scenario learning.",
    status: "live",
    externalUrl: "https://aipoweredcbeguide.vercel.app/",
    image: "/products/career-compass.svg",
    features: [
      "AI career assessment (4-pillar analysis)",
      "Kenya CBE pathway recommendations",
      "AI counselor chat",
      "STEM, Social Sciences & Arts pathways",
      "Expert-verified guidance",
      "Free to start — no credit card required",
    ],
    howItWorks: [
      "Create a free account in under a minute",
      "Take the AI-powered 4-pillar career assessment",
      "Receive personalized pathway recommendations for Kenya's CBE curriculum",
      "Chat with the AI counselor or connect with verified experts",
      "Access resources, scenarios, and career guides to start your journey",
    ],
  },
  {
    slug: "biometric-voting-system",
    title: "Biometric Voting System",
    tagline: "Secure, transparent elections built for Kenya",
    description:
      "TechFlare Solutions is actively developing a next-generation biometric voting platform designed for institutional and national-scale elections. Voters authenticate via secure biometric identity, cast encrypted votes, and results are tallied with full audit trails — built with IEBC-grade security standards in mind.",
    status: "in-development",
    image: "/products/biometric-voting-system.png",
    features: [
      "Biometric voter authentication",
      "Tamper-proof vote recording",
      "Real-time results dashboard",
      "Full audit trail & verification",
      "Multi-language support",
      "Offline-capable kiosk mode",
    ],
    howItWorks: [
      "Voter verifies identity via biometric scan at the kiosk",
      "Secure ballot interface displays verified candidates",
      "Vote is encrypted and recorded with a confirmation receipt",
      "Results aggregate in real time with full audit logging",
      "Independent verification and transparent result publishing",
    ],
  },
  {
    slug: "biometric-class-attendance",
    title: "Biometric Class Attendance",
    tagline: "Contactless attendance for schools and institutions",
    description:
      "A biometric class attendance system is coming from TechFlare Solutions — designed for schools, colleges, and training institutions across Kenya. Fast check-in via fingerprint or facial recognition, real-time reporting for administrators, and seamless integration with existing school management systems.",
    status: "coming-soon",
    features: [
      "Fingerprint & facial recognition",
      "Real-time attendance dashboards",
      "Parent & admin notifications",
      "Multi-campus support",
      "Offline mode for low-connectivity areas",
      "API integrations with school systems",
    ],
  },
];

export const innovationWorkflow = [
  {
    step: 1,
    phase: "Spark",
    title: "Idea Submission",
    description: "Share your idea, invention, or business concept with our team.",
    hint: "Every breakthrough starts with a single spark.",
  },
  {
    step: 2,
    phase: "Discover",
    title: "Research Review",
    description: "Our research team conducts preliminary analysis and market scan.",
    hint: "We map the landscape before we build the path.",
  },
  {
    step: 3,
    phase: "Assess",
    title: "Risk Assessment",
    description: "Technical, financial, and operational risks are evaluated.",
    hint: "Clear-eyed analysis — no surprises down the road.",
  },
  {
    step: 4,
    phase: "Prove",
    title: "Feasibility Analysis",
    description: "Deep-dive into technical viability, resources, and timeline.",
    hint: "From concept to blueprint with real engineering rigor.",
  },
  {
    step: 5,
    phase: "Launch",
    title: "Decision",
    description: "Partnership proposal, development plan, or constructive feedback.",
    hint: "You leave with a clear next step — not a dead end.",
  },
];

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/products", label: "Products" },
  { href: "/innovation-hub", label: "Innovation program", highlight: true },
  { href: "/solutions", label: "Solutions" },
  { href: "/research", label: "Research" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
  { href: "/newsroom", label: "Newsroom" },
  { href: "/community", label: "Community" },
  { href: "/contact", label: "Contact" },
];
