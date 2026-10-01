"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import { navLinks } from "@/data/site";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/lib/use-client-ready";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const mounted = useClientReady();
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gold/20 bg-black/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
        <Logo size="xs" priority href="/" showName />

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gold/10",
                link.highlight && "text-gold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 hover:bg-gold/10"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5 text-gold" />
            ) : mounted ? (
              <Moon className="h-5 w-5 text-deep-blue" />
            ) : (
              <span className="h-5 w-5" />
            )}
          </button>
          <Button href="/login" variant="ghost" size="sm">
            Sign In
          </Button>
          <Button href="/innovation-hub" size="sm">
            Submit an Idea
          </Button>
        </div>

        <button
          className="rounded-lg p-2 lg:hidden hover:bg-gold/10"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold/20 bg-black/95 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium hover:bg-gold/10",
                  link.highlight && "text-gold"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-gold/20 pt-4">
              <Button href="/login" variant="outline" size="sm">
                Sign In
              </Button>
              <Button href="/innovation-hub" size="sm">
                Submit an Idea
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
