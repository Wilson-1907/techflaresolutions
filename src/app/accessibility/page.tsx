import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { company } from "@/data/site";

const features = [
  {
    title: "Text size",
    body: "Use the accessibility panel (bottom-left green icon) to increase or decrease text across the entire site. Settings are saved in your browser.",
  },
  {
    title: "Audio personal assistant",
    body: "Turn on Audio guide to hear page names when you navigate, summaries with Read this page aloud, and spoken labels as you tab through links and buttons. Works with your browser’s built-in speech — no extra app required.",
  },
  {
    title: "Skip to content",
    body: "Press Tab when the page loads to reach Skip to main content and jump past the navigation.",
  },
  {
    title: "Keyboard shortcut",
    body: "Press Alt + A anywhere on the site to open or close the accessibility panel.",
  },
  {
    title: "Visual options",
    body: "High contrast, underlined links, larger click targets, and reduced motion are available in the same panel.",
  },
  {
    title: "Screen readers",
    body: "We use semantic HTML, labels, alt text on images, and ARIA live regions. The TechFlare AI chat (bottom-right) can also answer questions and guide you to pages.",
  },
];

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        title="Accessibility"
        subtitle="Built for everyone — including blind and low-vision visitors"
        badge="A11y"
      />
      <section className="pb-24">
        <div className="mx-auto max-w-3xl space-y-6 px-4 lg:px-8">
          <GlassCard>
            <p className="text-muted-foreground leading-relaxed">
              TechFlare Solutions is committed to digital accessibility. We follow WCAG 2.2 Level AA
              practices and provide tools so you can read, hear, and navigate our site in the way that
              works best for you.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Open the <strong className="text-foreground">accessibility panel</strong> using the green
              icon at the bottom-left of every page, or press <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-sm">Alt</kbd> +{" "}
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-sm">A</kbd>.
            </p>
          </GlassCard>

          {features.map((f) => (
            <GlassCard key={f.title}>
              <h2 className="mb-2 text-lg font-bold text-gold">{f.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{f.body}</p>
            </GlassCard>
          ))}

          <GlassCard>
            <h2 className="mb-2 text-lg font-bold">Feedback</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you hit a barrier or need assistance using our site, contact us at{" "}
              <a href={`mailto:${company.email}`} className="text-gold underline">
                {company.email}
              </a>{" "}
              or WhatsApp {company.phone}. We respond as quickly as we can.
            </p>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
