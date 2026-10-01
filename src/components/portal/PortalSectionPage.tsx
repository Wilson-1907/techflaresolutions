import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

interface PortalSectionPageProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PortalSectionPage({ title, description, children }: PortalSectionPageProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>
      {children ?? (
        <GlassCard>
          <p className="text-sm text-muted-foreground">
            This section is active. Full features will expand as your TechFlare Solutions workspace grows.
          </p>
        </GlassCard>
      )}
    </div>
  );
}

export function PortalPlaceholderList({
  items,
  emptyMessage = "No items yet.",
}: {
  items: { title: string; subtitle?: string; badge?: string }[];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return (
      <GlassCard>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <GlassCard key={item.title} hover={false}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              {item.subtitle && <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>}
            </div>
            {item.badge && (
              <span className="text-xs font-medium text-gold uppercase shrink-0">{item.badge}</span>
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

export function PortalActionCard({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <GlassCard>
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button href={href} className="mt-4" size="sm">
        {label}
      </Button>
    </GlassCard>
  );
}
