import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "xs" | "sm" | "md";
  className?: string;
  href?: string;
  priority?: boolean;
  /** Full logo image already includes wordmark — keep false unless you need text beside a mark-only asset */
  showName?: boolean;
}

/** Compact header sizes — full logo asset includes name + tagline; keep small in nav only. */
const sizes = {
  xs: { width: 96, height: 32, className: "h-8 w-auto max-h-8" },
  sm: { width: 112, height: 36, className: "h-9 w-auto max-h-9" },
  md: { width: 128, height: 40, className: "h-10 w-auto max-h-10" },
};

export function CompanyWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold leading-tight whitespace-nowrap", className)}>
      <span className="text-gold">TechFlare</span>
      <span className="text-white/95"> Solutions</span>
    </span>
  );
}

export function Logo({
  size = "xs",
  className,
  href = "/",
  priority = false,
  showName = false,
}: LogoProps) {
  const { width, height, className: sizeClass } = sizes[size];

  const content = (
    <>
      <Image
        src="/logo.png"
        alt={`${company.name} — ${company.tagline}`}
        width={width}
        height={height}
        priority={priority}
        unoptimized
        className={cn(sizeClass, "object-contain object-left bg-transparent shrink-0", className)}
      />
      {showName && <CompanyWordmark className="ml-2 text-[10px] sm:text-sm leading-tight" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center max-w-[7.5rem] sm:max-w-[9rem]" aria-label={company.name}>
        {content}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center max-w-[9rem]">{content}</span>;
}
