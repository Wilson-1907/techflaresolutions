import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { company, navLinks } from "@/data/site";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-deep-blue/40">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo size="sm" href="/" className="mb-4" showName />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {company.brandStatement}
            </p>
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
            <h3 className="mb-4 font-semibold text-gold">Portals</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portal/client" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link href="/portal/innovation" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Innovation Portal
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
                {company.email}
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-gold" />
                {company.phone}
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-life-green mt-0.5" />
                {company.offices[0].address}, {company.offices[0].city}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gold/20 pt-8 md:flex-row">
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
