import Image from "next/image";
import { company, logoSymbols } from "@/data/site";
import { GlassCard } from "@/components/ui/GlassCard";

export function BrandIdentitySection() {
  return (
    <section className="space-y-10">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt={`${company.name} — ${company.tagline}`}
          width={160}
          height={52}
          unoptimized
          className="mx-auto h-12 w-auto object-contain bg-transparent"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {logoSymbols.map((symbol, i) => (
          <GlassCard key={symbol.name} delay={i * 0.05}>
            <h3 className="font-semibold text-gold">{symbol.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{symbol.meaning}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
