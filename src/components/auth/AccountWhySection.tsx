import Link from "next/link";
import { CheckCircle2, LogIn, Shield, Sparkles } from "lucide-react";
import { accountVsCommunity } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  signInHref?: string;
  compact?: boolean;
};

export function AccountWhySection({ className = "", signInHref = "/login", compact = false }: Props) {
  const { accountTitle, accountDescription, accountReasons, accountCta } = accountVsCommunity;

  return (
    <section className={cn("py-16 sm:py-20", className)} aria-labelledby="why-account-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <GlassCard className={cn("border-gold/25", compact ? "p-6 sm:p-8" : "p-8 sm:p-10 lg:p-12")}>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
                <Shield className="h-3.5 w-3.5" />
                Member workspace
              </div>
              <h2 id="why-account-heading" className="text-2xl font-bold sm:text-3xl">
                {accountTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base leading-relaxed">
                {accountDescription}
              </p>

              <ul className="mt-6 space-y-3">
                {accountReasons.map((reason) => (
                  <li key={reason} className="flex gap-3 text-sm text-foreground sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-life-green" aria-hidden />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:items-center lg:min-w-[220px] lg:items-stretch">
              <div className="mb-1 hidden lg:flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
                <Sparkles className="h-6 w-6" />
              </div>
              <Button href={signInHref} size="lg" className="w-full sm:w-auto lg:w-full">
                <LogIn className="h-5 w-5" />
                {accountCta}
              </Button>
              <p className="text-center text-xs text-muted-foreground lg:text-left">
                Already have an account?{" "}
                <Link href={signInHref} className="text-gold hover:underline">
                  Sign in
                </Link>
                {" · "}
                <Link href="/register" className="text-gold hover:underline">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
