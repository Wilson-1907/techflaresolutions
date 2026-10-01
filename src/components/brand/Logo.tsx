import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
  priority?: boolean;
  showName?: boolean;
}

const sizes = {
  xs: { width: 80, height: 80, className: "h-10 w-auto" },
  sm: { width: 120, height: 120, className: "h-14 w-auto" },
  md: { width: 160, height: 160, className: "h-16 w-auto" },
  lg: { width: 220, height: 220, className: "h-24 w-auto" },
  xl: { width: 280, height: 280, className: "h-32 w-auto" },
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
  size = "sm",
  className,
  href = "/",
  priority = false,
  showName = true,
}: LogoProps) {
  const { width, height, className: sizeClass } = sizes[size];

  const content = (
    <>
      <Image
        src="/logo.png"
        alt={`${company.name} — ${company.subtagline}`}
        width={width}
        height={height}
        priority={priority}
        className={cn(sizeClass, "object-contain", className)}
      />
      {showName && <CompanyWordmark className="ml-2 text-[10px] sm:text-sm leading-tight" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center" aria-label={company.name}>
        {content}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{content}</span>;
}
