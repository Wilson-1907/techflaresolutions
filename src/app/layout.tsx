import type { Metadata, Viewport } from "next";
import { Outfit, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { StatsProvider } from "@/components/providers/StatsProvider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { AccessibilitySuite } from "@/components/accessibility/AccessibilitySuite";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { ConditionalAIAssistant } from "@/components/layout/ConditionalAIAssistant";
import { CopyProtection } from "@/components/security/CopyProtection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SEO_DEFAULT_DESCRIPTION, SEO_KEYWORDS } from "@/data/seo";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.techflare-solutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TechFlare Solutions | Technology, Research, Software & AI",
    template: "%s | TechFlare Solutions",
  },
  description: SEO_DEFAULT_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: "TechFlare Solutions" }],
  creator: "TechFlare Solutions",
  publisher: "TechFlare Solutions",
  alternates: { canonical: "/" },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "TechFlare Solutions | Technology, Research, Software & AI",
    description:
      "Research-driven software, AI, automation, and idea-to-solution delivery. Modern technology for businesses and innovators.",
    type: "website",
    url: siteUrl,
    siteName: "TechFlare Solutions",
    images: ["/logo.png"],
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechFlare Solutions",
    description: "Technology, research, software, AI, ideas, and automation.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050b14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${sora.variable} h-full dark`}>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground overflow-x-hidden font-sans">
        <ThemeProvider>
          <AccessibilityProvider>
            <StatsProvider>
              <JsonLd />
              <CopyProtection />
              <AccessibilitySuite />
              <ConditionalNavbar />
              <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
                {children}
              </main>
              <ConditionalFooter />
              <ConditionalAIAssistant />
            </StatsProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
