interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-blue/30 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 text-center">
        {badge && (
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-wider mb-4">
            {badge}
          </span>
        )}
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
