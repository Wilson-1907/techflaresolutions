export const company = {
  name: "TechFlare Solutions",
  shortName: "TechFlare Solutions",
  tagline: "Transforming Ideas Into World-Class Solutions",
  subtagline: "Flare Up the Future, with Lines of Codes",
  brandStatement:
    "TechFlare Solutions is built on character, color, and care — resilience like the lion, royalty in how we serve, depth in our blue, and purity in everything we deliver.",
  mission:
    "To bridge the gap between groundbreaking ideas and world-class technology solutions through rigorous research, innovative engineering, and relentless execution.",
  vision:
    "To become the global leader in idea-to-solution transformation, empowering innovators, businesses, and governments to solve humanity's most pressing challenges.",
  website: process.env.NEXT_PUBLIC_APP_URL || "https://www.techflare-solutions.com",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "solutionstechflare@gmail.com",
  solutionsEmail: process.env.NEXT_PUBLIC_SOLUTIONS_EMAIL || "solutionstechflare@gmail.com",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+254 769227291",
  phoneLocal: "0769227291",
  whatsapp: "254769227291",
  whatsappLink: "https://wa.me/254769227291",
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
        href: "https://www.facebook.com/profile.php?id=61592088802525",
      },
      {
        id: "tiktok",
        name: "TikTok",
        handle: "techflare_solutions",
        href: "https://www.tiktok.com/@techflare_solutions",
      },
      { id: "x", name: "X", handle: "techflare_solutions", href: "https://x.com/stechflare" },
      {
        id: "linkedin",
        name: "LinkedIn",
        handle: "techflare_solutions",
        href: "https://www.linkedin.com/company/techflaresolutionss",
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
    "Registered clients earn TechFlare Solutions Points equal to 5% of profit value on qualifying projects. Redeem points for product discounts, awards, and exclusive benefits.",
};

export const accountVsCommunity = {
  accountTitle: "Create an Account",
  accountDescription:
    "Signing up gives you a secure TechFlare Solutions portal — track projects, submit ideas, use our AI tools, and earn client reward points. This is your private workspace with us.",
  communityTitle: "Join Our Community",
  communityDescription:
    "Our community is separate from your website account. Join our WhatsApp group to receive notifications, share your email for activity updates, and access careers and innovation programs.",
  communitySteps: [
    "Create your TechFlare Solutions account (recommended for portal and points)",
    "Join our WhatsApp community via the official link",
    "Share your email in the group for notifications and event reminders",
    "Apply for careers and participate in community innovation activities",
  ],
};

export const brandIdentity = {
  title: "The TechFlare Solutions Character",
  subtitle: "Every color and symbol reflects how we serve — with strength, loyalty, trust, and purity.",
  pillars: [
    {
      symbol: "🦁",
      title: "The Lion — Resilience",
      accent: "gold",
      description:
        "The lion is our emblem of resilience — courageous, strong, and unwavering. TechFlare Solutions endures every challenge, protects what matters, and leads with fearless innovation.",
    },
    {
      symbol: "👑",
      title: "Gold — Dominance & Loyalty",
      accent: "gold",
      description:
        "Gold shows dominance forged through excellence — and loyalty that never fades. At TechFlare Solutions, we treat every client, partner, and innovator like kings and queens.",
    },
    {
      symbol: "🛡️",
      title: "Deep Blue — Trust & Character",
      accent: "blue",
      description:
        "Our famous deep blue stands for character you can rely on — steady, professional, and deeply rooted. It is the foundation every TechFlare Solutions solution is built upon.",
    },
    {
      symbol: "✨",
      title: "White — Pure, Clean & Holy",
      accent: "white",
      description:
        "White is pure, clean, and holy — the standard we hold in our code, our conduct, and our commitments. TechFlare Solutions delivers with integrity you can trust.",
    },
  ],
};

/** Professional values shown on the About page (brand character lives on the homepage only). */
export const coreValues = [
  { title: "Innovation First", description: "Every challenge is an opportunity to pioneer something extraordinary." },
  { title: "Research-Driven", description: "Decisions backed by data, analysis, and rigorous methodology." },
  { title: "Client Partnership", description: "We succeed only when our clients achieve transformative outcomes." },
  { title: "Integrity", description: "Transparency and ethical practices in every engagement." },
  { title: "Excellence", description: "World-class standards in every line of code and every deliverable." },
  { title: "Global Impact", description: "Technology that serves communities and advances humanity." },
];

export const leadership = [
  {
    name: "TechFlare Solutions Leadership",
    role: "Founding Team · Kenya",
    bio: "A Kenya-based innovation and engineering team building digital products for schools, enterprises, and communities.",
  },
];

/** Shown with client permission on Work pages and homepage portfolio. */
export const showcaseConsentNote =
  "Projects listed as delivered are shown with the clients’ acceptance to showcase their work. TechFlare Solutions only publishes named client examples after the client has agreed that we may feature the project publicly as evidence of what we deliver.";

/** Delivered client work (live or completed) — not templates. */
export const portfolioProjects = [
  {
    slug: "st-gabriel-mission-schools",
    title: "St Gabriel Mission Schools",
    client: "St Gabriel Mission Schools",
    domain: "https://stgabrielsmissionschools.sc.ke",
    category: "Education · Institutional Website",
    kind: "delivered" as const,
    status: "Live",
    year: "2025",
    summary:
      "A modern school website for St Gabriel Mission Schools — admissions, campus life, academics, and parent communication in a clean digital experience.",
    outcomes: [
      "Live institutional site on stgabrielsmissionschools.sc.ke",
      "Mobile-first admissions and campus storytelling",
      "SEO-ready structure for school discovery in Kenya",
    ],
    tags: ["Next.js", "School CMS", "Responsive", "SEO"],
    featured: true,
    showcaseConsent: true,
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "client-delivery-portal",
    title: "Client Delivery Portal",
    client: "TechFlare Solutions platform clients",
    domain: "/portal/client",
    category: "SaaS · Client Workspace",
    kind: "delivered" as const,
    status: "In production",
    year: "2025",
    summary:
      "Secure client workspace for projects, invoices, documents, and support — the same delivery standard we roll out for organizations that need a private portal.",
    outcomes: [
      "Role-based access for clients and admins",
      "Project tracking and document handoff",
      "Integrated with TechFlare Solutions operations",
    ],
    tags: ["Auth", "Dashboard", "Portal UX", "Secure"],
    featured: true,
    showcaseConsent: true,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
  },
  {
    slug: "innovation-hub-platform",
    title: "Innovation Hub Platform",
    client: "TechFlare Solutions Innovation Program",
    domain: "/innovation-hub",
    category: "Platform · Idea Pipeline",
    kind: "delivered" as const,
    status: "Live",
    year: "2025",
    summary:
      "End-to-end innovation pipeline — idea submission, review stages, and innovator tracking — proof that we build real product workflows, not just marketing pages.",
    outcomes: [
      "Structured idea → review → decision workflow",
      "Signed-in innovator submissions",
      "Admin-ready pipeline for program teams",
    ],
    tags: ["Workflow", "Portal", "R&D", "Product"],
    featured: true,
    showcaseConsent: true,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop",
  },
];

/**
 * Modern templates = capability evidence.
 * These are not client claims; they show the digital products and UX systems we can ship.
 */
export const modernTemplates = [
  {
    title: "School & Mission Website",
    description:
      "Admissions, news, galleries, academics, and contact — the pattern behind institutional sites like St Gabriel Mission Schools.",
    evidence: "Evidence we ship polished education websites end-to-end.",
    stack: ["Next.js", "SEO", "Mobile-first", "CMS-ready"],
    href: "/work/st-gabriel-mission-schools",
  },
  {
    title: "Innovation Hub Portal",
    description: "Idea submission, review pipelines, and innovator tracking for R&D and community programs.",
    evidence: "Evidence we build multi-step product workflows with auth.",
    stack: ["Auth", "Dashboards", "Pipelines", "Notifications"],
    href: "/innovation-hub",
  },
  {
    title: "Solutions Commerce",
    description: "Product catalog, plans, and email-order flows for digital products and services.",
    evidence: "Evidence we can launch conversion-ready product pages.",
    stack: ["Catalog", "Pricing", "CTA flows", "Lead capture"],
    href: "/products",
  },
  {
    title: "Enterprise Client Portal",
    description: "Projects, invoices, documents, and support in one secure branded workspace.",
    evidence: "Evidence we deliver private portals clients actually use.",
    stack: ["RBAC", "Documents", "Billing views", "Support"],
    href: "/portal/client",
  },
  {
    title: "Product Launch Landing",
    description: "High-converting launch pages with feature grids, pricing, and clear next actions.",
    evidence: "Evidence of modern marketing templates we brand for launches.",
    stack: ["Landing UX", "Motion", "Conversion", "Brand systems"],
    href: "/products",
  },
  {
    title: "Admin Operations Console",
    description: "CRM, finance views, projects, and operations tools for running a digital business.",
    evidence: "Evidence we build serious back-office systems, not only public sites.",
    stack: ["Admin UX", "Data tables", "Ops workflows", "Security"],
    href: "/contact",
  },
];

export const services = [
  {
    slug: "innovation-consulting",
    title: "Innovation Consulting",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop",
    description: "Strategic guidance to transform ideas into viable products.",
  },
  {
    slug: "software-development",
    title: "Software Development",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80&auto=format&fit=crop",
    description: "Custom applications built with cutting-edge technologies.",
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
    description: "Machine learning, NLP, and intelligent automation systems.",
  },
  {
    slug: "data-engineering",
    title: "Data Engineering",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
    description: "Pipelines, warehouses, and analytics infrastructure.",
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format&fit=crop",
    description: "AWS, Azure, and GCP architecture and migration.",
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80&auto=format&fit=crop",
    description: "Threat assessment, compliance, and security architecture.",
  },
  {
    slug: "research-development",
    title: "Research & Development",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80&auto=format&fit=crop",
    description: "Applied research and prototype development.",
  },
  {
    slug: "product-development",
    title: "Product Development",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80&auto=format&fit=crop",
    description: "End-to-end product lifecycle from concept to launch.",
  },
];

export const industries = [
  { slug: "education", title: "Education", icon: "🎓", description: "Digital learning platforms, examination security, and campus management." },
  { slug: "healthcare", title: "Healthcare", icon: "🏥", description: "Patient management, telemedicine, and health data analytics." },
  { slug: "agriculture", title: "Agriculture", icon: "🌾", description: "Smart farming, crop monitoring, and supply chain optimization." },
  { slug: "government", title: "Government", icon: "🏛️", description: "E-governance, secure voting, and citizen service platforms." },
  { slug: "finance", title: "Finance", icon: "💰", description: "Fintech solutions, payment systems, and regulatory compliance." },
  { slug: "logistics", title: "Logistics", icon: "🚚", description: "Fleet management, route optimization, and warehouse automation." },
  { slug: "manufacturing", title: "Manufacturing", icon: "🏭", description: "IoT integration, predictive maintenance, and quality control." },
];

export const products = [
  {
    slug: "biometric-attendance",
    title: "Biometric Attendance System",
    tagline: "Secure, contactless attendance for institutions",
    description: "Enterprise-grade biometric attendance with facial recognition, fingerprint, and RFID support.",
    features: ["Facial recognition", "Real-time reporting", "Multi-campus support", "API integrations", "Offline mode"],
    pricing: { starter: 299, professional: 799, enterprise: "Custom" },
  },
  {
    slug: "blockchain-voting",
    title: "Blockchain Voting Platform",
    tagline: "Transparent, tamper-proof democratic elections",
    description: "Secure electronic voting with blockchain verification and end-to-end audit trails.",
    howItWorks: [
      "Voters authenticate via secure digital identity",
      "Votes are encrypted and recorded on blockchain",
      "Real-time tallying with tamper-proof audit logs",
      "Results published with full verification trail",
    ],
    terms: [
      "Minimum 12-month service agreement for institutional deployments",
      "Setup, training, and compliance support included in Professional tier",
      "Data hosted in secure cloud with Kenyan data protection compliance",
      "Custom SLAs available for national and enterprise elections",
    ],
    features: ["Blockchain verification", "Voter authentication", "Real-time results", "Audit trails", "Multi-language"],
    pricing: { starter: 4999, professional: 14999, enterprise: "Custom" },
  },
  {
    slug: "examination-security",
    title: "Examination Security System",
    tagline: "AI-powered exam integrity and proctoring",
    description: "Comprehensive examination security with AI proctoring, question bank management, and analytics.",
    features: ["AI proctoring", "Question randomization", "Plagiarism detection", "Secure browser", "Analytics dashboard"],
    pricing: { starter: 199, professional: 599, enterprise: "Custom" },
  },
  {
    slug: "smart-agriculture",
    title: "Smart Agriculture Platform",
    tagline: "IoT-driven precision farming intelligence",
    description: "Monitor crops, soil, weather, and equipment with AI-powered recommendations.",
    features: ["IoT sensor integration", "Crop health AI", "Weather forecasting", "Irrigation automation", "Market insights"],
    pricing: { starter: 149, professional: 449, enterprise: "Custom" },
  },
];

export const innovationWorkflow = [
  { step: 1, title: "Idea Submission", description: "Share your idea, invention, or business concept with our team." },
  { step: 2, title: "Research Review", description: "Our research team conducts preliminary analysis and market scan." },
  { step: 3, title: "Risk Assessment", description: "Technical, financial, and operational risks are evaluated." },
  { step: 4, title: "Feasibility Analysis", description: "Deep-dive into technical viability, resources, and timeline." },
  { step: 5, title: "Decision", description: "Partnership proposal, development plan, or constructive feedback." },
];

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/industries", label: "Industries" },
  { href: "/products", label: "Products" },
  { href: "/innovation-hub", label: "Innovation Hub", highlight: true },
  { href: "/solutions", label: "Solutions" },
  { href: "/research", label: "Research" },
  { href: "/careers", label: "Careers" },
  { href: "/newsroom", label: "Newsroom" },
  { href: "/contact", label: "Contact" },
];
