interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-70 pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 text-center">
        {badge && (
          <span className="inline-block text-cyan-300/90 text-sm font-semibold uppercase tracking-[0.22em] mb-4">
            {badge}
          </span>
        )}
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
