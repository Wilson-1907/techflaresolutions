import { cn } from "@/lib/utils";
import { buildEmailComposeLink, type EmailComposeOptions, type MailtoContext } from "@/lib/mailto";

type EmailLinkProps = {
  context: MailtoContext;
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  extraLines?: string[];
  className?: string;
  children: React.ReactNode;
  title?: string;
};

export function EmailLink({
  context,
  name,
  email,
  phone,
  organization,
  extraLines,
  className,
  children,
  title = "Email us",
}: EmailLinkProps) {
  const options: EmailComposeOptions = { name, email, phone, organization, extraLines };
  const href = buildEmailComposeLink(context, options);
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn("inline-flex items-center gap-2 hover:text-gold transition-colors", className)}
      title={title}
    >
      {children}
    </a>
  );
}
