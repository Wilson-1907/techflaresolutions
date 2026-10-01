import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { StatsProvider } from "@/components/providers/StatsProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { CopyProtection } from "@/components/security/CopyProtection";
import { JsonLd } from "@/components/seo/JsonLd";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.techflare-solutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TechFlare Solutions | Flare Up the Future, with Lines of Codes",
    template: "%s | TechFlare Solutions",
  },
  description:
    "TechFlare Solutions — Research. Innovation. Engineering. Deployment. Bring your problem or idea. We research, validate, build, and launch world-class technology solutions from Kenya.",
  keywords: [
    "TechFlare Solutions",
    "innovation company Kenya",
    "software development Kenya",
    "AI solutions",
    "Innovation Hub",
    "blockchain voting",
    "research and development",
    "technology consulting",
    "Karatina",
    "Nyeri",
  ],
  authors: [{ name: "TechFlare Solutions" }],
  creator: "TechFlare Solutions",
  publisher: "TechFlare Solutions",
  applicationName: "TechFlare Solutions",
  category: "Technology",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TechFlare Solutions | Flare Up the Future, with Lines of Codes",
    description:
      "Research. Innovation. Engineering. Deployment. Transform ideas into world-class technology solutions.",
    url: siteUrl,
    siteName: "TechFlare Solutions",
    type: "website",
    locale: "en_KE",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "TechFlare Solutions logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechFlare Solutions",
    description: "Flare Up the Future, with Lines of Codes",
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
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} h-full dark`}>
      <body className="min-h-full flex flex-col antialiased bg-black text-foreground font-sans">
        <JsonLd />
        <ThemeProvider>
          <StatsProvider>
            <CopyProtection />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <AIAssistant />
          </StatsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
