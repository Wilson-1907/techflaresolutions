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

/** Only two public notices / news items. */
export const OFFICIAL_NEWS: OfficialNewsArticle[] = [
  {
    id: "we-will-open-soon",
    slug: "we-will-open-soon",
    title: "We will open soon",
    category: "announcement",
    excerpt:
      "TechFlare Solutions is preparing for official opening. Follow this newsroom for launch timing and early access updates.",
    content: `TechFlare Solutions will open soon.

We are finalizing platforms, delivery operations, and partner onboarding ahead of our official opening. Until then, this newsroom carries only essential public notices.

For partnership inquiries, contact solutionstechflare@gmail.com.`,
    authorName: "TechFlare Solutions Corporate Communications",
    publishedAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "we-are-open",
    slug: "we-are-open",
    title: "We are open",
    category: "announcement",
    excerpt:
      "TechFlare Solutions is open — services, products, Innovation Hub, and client registration are available.",
    content: `TechFlare Solutions is open.

Clients, innovators, and partners can register, explore our services and products, submit ideas through the Innovation Hub, and start delivery engagements with our team.

Visit /services, /products, or /contact to begin.`,
    authorName: "TechFlare Solutions Operations",
    publishedAt: "2026-07-01T09:00:00.000Z",
  },
];

export const OFFICIAL_BLOGS: OfficialBlogPost[] = [
  {
    id: "our-vision-flaring-up-the-future",
    slug: "our-vision-flaring-up-the-future",
    title: "Our Vision: Flaring Up the Future with Lines of Code",
    excerpt:
      "TechFlare Solutions builds world-class software and turns bold ideas into scalable products through research, AI, and automation.",
    content: `Technology shapes economies and opportunity. At TechFlare Solutions, we combine engineering excellence with commercial discipline — research, software, AI, and automation that ship reliably.`,
    tags: "company,vision,technology,research,software,AI",
    publishedAt: "2026-05-20T09:00:00.000Z",
    author: {
      firstName: "TechFlare",
      lastName: "Leadership",
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
