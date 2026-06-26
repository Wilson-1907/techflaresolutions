"use client";

const items = [
  "AI & Machine Learning",
  "Cloud Architecture",
  "Mobile Engineering",
  "Cybersecurity",
  "FinTech Solutions",
  "IoT & Edge Computing",
  "Data Analytics",
  "DevOps & CI/CD",
  "UI/UX Design",
  "Blockchain",
  "Enterprise SaaS",
  "Innovation Labs",
];

export function AnimatedMarquee() {
  const doubled = [...items, ...items];

  return (
    <section className="relative overflow-hidden border-y border-gold/20 bg-deep-blue/40 py-6">
      <div className="animate-marquee flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-gold/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-life-green animate-pulse" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
