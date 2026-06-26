import { Mail, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildEmailComposeLink,
  buildMailtoSubject,
  type EmailComposeOptions,
  type MailtoContext,
} from "@/lib/mailto";

type OpenGmailButtonProps = {
  context: MailtoContext;
  composeOptions?: EmailComposeOptions;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
  showSubject?: boolean;
  children?: React.ReactNode;
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variantClasses = {
  primary:
    "bg-gradient-to-r from-gold to-gold-dark text-black hover:from-gold-light hover:to-gold shadow-lg shadow-gold/25",
  secondary:
    "bg-gradient-to-r from-life-green to-life-green-dark text-white hover:opacity-90 shadow-lg shadow-life-green/25",
  outline: "border border-gold/40 text-foreground hover:bg-gold/10 hover:border-gold",
  ghost: "text-foreground hover:bg-gold/10",
};

export function OpenGmailButton({
  context,
  composeOptions,
  className,
  size = "md",
  variant = "primary",
  showSubject = false,
  children,
}: OpenGmailButtonProps) {
  const href = buildEmailComposeLink(context, composeOptions);
  const subject = buildMailtoSubject(context);
  const external = href.startsWith("http");

  return (
    <div className={cn("space-y-2", className)}>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        title="Email us"
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
          sizeClasses[size],
          variantClasses[variant]
        )}
      >
        {children ?? (
          <>
            <Mail className="h-5 w-5" />
            Email us
            <ExternalLink className="h-4 w-4 opacity-70" />
          </>
        )}
      </a>
      {showSubject && (
        <p className="text-xs text-muted-foreground">
          Subject: <span className="text-gold">{subject}</span>
        </p>
      )}
    </div>
  );
}
