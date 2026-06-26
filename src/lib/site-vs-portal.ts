/** Copy and labels that keep the public website separate from member workspaces. */

export const SITE_LABELS = {
  companyName: "TechFlare Solutions",
  publicSite: "Company website",
  companyBlog: "Company blog",
  innovationProgram: "Innovation program", // public info page at /innovation-hub
} as const;

export const PORTAL_LABELS = {
  client: "Client workspace",
  innovator: "Innovator workspace",
  employee: "Employee workspace",
  workspaceHint:
    "You are in your private workspace — projects, invoices, and submissions live here. News, services, and the company blog are on the public website.",
  blogHint: "The company blog is published by TechFlare on the main site. Share your experience here under Testimonials.",
} as const;
