"use client";

const items = [
  "Technology",
  "Research",
  "Software",
  "Artificial Intelligence",
  "Ideas",
  "Automation",
  "Point of Sale",
  "Cloud Architecture",
  "Cybersecurity",
  "IoT & Edge",
  "Data Engineering",
  "Product Development",
];

export function AnimatedMarquee() {
  const doubled = [...items, ...items];

  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-[#08101c]/80 py-5">
      <div className="animate-marquee flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
