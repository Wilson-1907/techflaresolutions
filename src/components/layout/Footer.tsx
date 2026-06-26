import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { company, navLinks } from "@/data/site";
import { EmailLink } from "@/components/ui/EmailLink";
import { ContactChannelWidgets } from "@/components/brand/ContactChannelWidgets";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-deep-blue/40">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-bold text-gold text-sm mb-1">{company.name}</p>
            <p className="text-xs text-gold/80 mb-2">{company.tagline}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{company.mission}</p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gold">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gold">Member access</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Sign in for your private workspace — separate from this public website.
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/portal/client" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Client workspace
                </Link>
              </li>
              <li>
                <Link href="/portal/innovation" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Innovator workspace
                </Link>
              </li>
              <li>
                <Link href="/portal/employee" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Employee workspace
                </Link>
              </li>
              <li>
                <Link href="/newsroom" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link href="/investor-relations" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gold">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-gold" />
                <EmailLink context={{ type: "contact" }}>
                  {company.email}
                </EmailLink>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-life-green mt-0.5" />
                {company.offices[0].address}, {company.offices[0].city}
              </li>
            </ul>
          </div>
        </div>

        <ContactChannelWidgets variant="footer" className="mt-10" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gold/20 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
            <Link href="/accessibility" className="hover:text-gold transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
