export type OfficialNewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  authorName: string;
  publishedAt: string;
};

export type OfficialBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  publishedAt: string;
  author: {
    firstName: string;
    lastName: string;
    role: string;
    company: string;
  };
};

export const OFFICIAL_LAUNCH_DATE = "1 July 2026";

export const OFFICIAL_NEWS: OfficialNewsArticle[] = [
  {
    id: "official-launch-1-july-2026",
    slug: "official-launch-1-july-2026",
    title: "TechFlare Solutions Official Launch — 1 July 2026",
    category: "press_release",
    excerpt:
      "TechFlare Solutions will officially open and launch on 1 July 2026 — delivering enterprise software, innovation services, and digital transformation across Africa and beyond.",
    content: `Nairobi, Kenya — TechFlare Solutions today confirms its official public launch on 1 July 2026.

Following a structured pre-launch phase, the company is finalizing its platform, client portals, Innovation Hub, and enterprise delivery operations ahead of opening day. From 1 July 2026, clients, innovators, and partners will access the full TechFlare ecosystem: custom software development, product engineering, managed solutions, and end-to-end innovation support.

"Our mission is clear: Flaring Up the Future with Lines of Code," said the TechFlare leadership team. "We are building a technology company that operates at international standards — with the discipline of enterprise engineering and the ambition to lead in our industry."

What to expect at launch:
• Full client and innovator registration and portal access
• Innovation Hub submissions and feasibility analysis
• Enterprise software, web, mobile, and AI solutions
• Transparent project tracking, billing, and support

Until launch, this newsroom will publish pre-launch updates. For partnership inquiries, contact hello@techflaresolutions.com.`,
    authorName: "TechFlare Solutions Corporate Communications",
    publishedAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "pre-launch-platform-nears-completion",
    slug: "pre-launch-platform-nears-completion",
    title: "Pre-Launch Update: Enterprise Platform Nears Completion",
    category: "announcement",
    excerpt:
      "TechFlare Solutions confirms its unified client portal, innovator pipeline, and admin operations are entering final validation ahead of the 1 July 2026 launch.",
    content: `TechFlare Solutions is in the final stages of pre-launch validation across its core platform — client onboarding, project delivery workflows, Innovation Hub intake, and secure admin operations.

The company has invested in a production-grade architecture designed for scale: verified user registration, role-based portals, structured project milestones, integrated billing, and a dedicated newsroom and insights channel for transparent communication.

This pre-launch period reflects our commitment to launching with operational maturity — not as a prototype, but as a company ready to compete and win in the software and innovation industry.`,
    authorName: "TechFlare Solutions Operations",
    publishedAt: "2026-05-15T09:00:00.000Z",
  },
  {
    id: "innovation-hub-accepting-submissions",
    slug: "innovation-hub-accepting-submissions",
    title: "Innovation Hub Now Accepting Submissions Ahead of Launch",
    category: "announcement",
    excerpt:
      "Innovators, researchers, and founders can submit ideas to the TechFlare Innovation Hub as the company prepares for its official 1 July 2026 opening.",
    content: `The TechFlare Innovation Hub is accepting idea submissions ahead of the company's official launch on 1 July 2026.

Whether you are building in agriculture, fintech, health, education, or emerging technology, TechFlare provides structured pathways from concept through feasibility analysis, prototyping, and commercial delivery.

Submit your idea through the Innovation Hub on our website. Registered innovators will receive portal access at launch to track progress, upload materials, and collaborate with our team.

TechFlare Solutions is building the infrastructure for serious innovation — with the governance, engineering depth, and commercial focus required to bring ideas to market.`,
    authorName: "Innovation Hub · TechFlare Solutions",
    publishedAt: "2026-05-01T09:00:00.000Z",
  },
];

export const OFFICIAL_BLOGS: OfficialBlogPost[] = [
  {
    id: "our-vision-flaring-up-the-future",
    slug: "our-vision-flaring-up-the-future",
    title: "Our Vision: Flaring Up the Future with Lines of Code",
    excerpt:
      "TechFlare Solutions exists to build world-class software and turn bold ideas into scalable products. Here is the standard we hold ourselves to ahead of our July 2026 launch.",
    content: `Technology is not neutral — it shapes economies, communities, and opportunity. At TechFlare Solutions, we believe Africa and the global market deserve technology partners who combine engineering excellence with commercial discipline.

Our vision is straightforward: build software and innovation services that meet enterprise standards, ship reliably, and create measurable value for clients and innovators.

We are not interested in vanity projects or disconnected demos. We are building a company designed to dominate our industry through rigorous engineering, transparent delivery, structured innovation, and long-term operational excellence.

On 1 July 2026, TechFlare Solutions officially opens its doors. Until then, we are preparing every system, process, and team capability to operate at the level our clients and partners expect from a serious technology company.`,
    tags: "company,vision,leadership",
    publishedAt: "2026-05-20T09:00:00.000Z",
    author: {
      firstName: "TechFlare",
      lastName: "Leadership",
      role: "ADMIN",
      company: "TechFlare Solutions",
    },
  },
  {
    id: "africa-next-wave-software-innovation",
    slug: "africa-next-wave-software-innovation",
    title: "Why Africa Will Lead the Next Wave of Software Innovation",
    excerpt:
      "From mobile-first markets to deep domain expertise in agriculture, finance, and logistics, Africa is positioned to define the next generation of software — and TechFlare is built for that future.",
    content: `The next decade of software innovation will not be defined solely in traditional tech hubs. It will be defined by markets that solve real problems at scale — often with fewer legacy constraints and greater urgency for impact.

Africa represents one of the most dynamic technology frontiers in the world. Mobile penetration, entrepreneurial energy, and domain-specific challenges create an environment where great software is not optional — it is essential infrastructure.

TechFlare Solutions is headquartered in this reality. We design for mobile-first architectures, solutions grounded in local context with global quality standards, and delivery models that respect budget discipline and operational clarity.`,
    tags: "industry,africa,innovation",
    publishedAt: "2026-05-10T09:00:00.000Z",
    author: {
      firstName: "TechFlare",
      lastName: "Editorial",
      role: "ADMIN",
      company: "TechFlare Solutions",
    },
  },
  {
    id: "techflare-standard-engineering-discipline",
    slug: "techflare-standard-engineering-discipline",
    title: "The TechFlare Standard: Engineering Discipline Meets Bold Ideas",
    excerpt:
      "World-class products require more than code — they require process, architecture, security, and accountability. This is the standard every TechFlare engagement is built on.",
    content: `Clients do not hire a technology company for activity. They hire for outcomes: systems that work, products that scale, and teams that communicate clearly when complexity arrives.

The TechFlare Standard is our operating contract with every client and innovator — discovery before development, architecture with intent, delivery in milestones, security by default, and professional communication throughout.

That is how companies ready to dominate an industry operate. That is how TechFlare Solutions is built.`,
    tags: "engineering,quality,enterprise",
    publishedAt: "2026-04-28T09:00:00.000Z",
    author: {
      firstName: "TechFlare",
      lastName: "Engineering",
      role: "ADMIN",
      company: "TechFlare Solutions",
    },
  },
  {
    id: "inside-innovation-hub-concept-to-product",
    slug: "inside-innovation-hub-concept-to-product",
    title: "Inside the Innovation Hub: From Concept to Commercial Product",
    excerpt:
      "The TechFlare Innovation Hub is not a suggestion box. It is a structured pipeline for researching, validating, and building ideas with commercial potential.",
    content: `Many organizations collect ideas. Few build the infrastructure to evaluate them honestly and develop the ones worth pursuing.

The TechFlare Innovation Hub is designed as a professional innovation pipeline — from structured intake and feasibility analysis through prototyping and commercial delivery pathways.

Ahead of our 1 July 2026 launch, the hub is open for submissions. At launch, registered innovators gain portal access to track status, share materials, and collaborate with our team.`,
    tags: "innovation,hub,products",
    publishedAt: "2026-04-15T09:00:00.000Z",
    author: {
      firstName: "Innovation",
      lastName: "Hub",
      role: "ADMIN",
      company: "TechFlare Solutions",
    },
  },
];

export function getOfficialNewsBySlug(slug: string) {
  return OFFICIAL_NEWS.find((item) => item.slug === slug);
}

export function getOfficialBlogBySlug(slug: string) {
  return OFFICIAL_BLOGS.find((item) => item.slug === slug);
}

export function mergeOfficialNews<T extends { slug: string }>(articles: T[]): T[] {
  const slugs = new Set(articles.map((a) => a.slug));
  const extras = OFFICIAL_NEWS.filter((item) => !slugs.has(item.slug));
  return [...articles, ...(extras as unknown as T[])].sort(
    (a, b) =>
      new Date((b as { publishedAt?: string }).publishedAt || 0).getTime() -
      new Date((a as { publishedAt?: string }).publishedAt || 0).getTime()
  );
}

export function mergeOfficialBlogs<T extends { slug: string }>(posts: T[]): T[] {
  const slugs = new Set(posts.map((p) => p.slug));
  const extras = OFFICIAL_BLOGS.filter((item) => !slugs.has(item.slug));
  return [...posts, ...(extras as unknown as T[])].sort(
    (a, b) =>
      new Date((b as { publishedAt?: string }).publishedAt || 0).getTime() -
      new Date((a as { publishedAt?: string }).publishedAt || 0).getTime()
  );
}
