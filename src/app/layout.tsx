import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { StatsProvider } from "@/components/providers/StatsProvider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { AccessibilitySuite } from "@/components/accessibility/AccessibilitySuite";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { ConditionalAIAssistant } from "@/components/layout/ConditionalAIAssistant";
import { CopyProtection } from "@/components/security/CopyProtection";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "TechFlare Solutions | IGNITING INNOVATIONS, DELIVERING SOLUTIONS",
    template: "%s | TechFlare Solutions",
  },
  description:
    "IGNITING INNOVATIONS, DELIVERING SOLUTIONS — TechFlare researches, validates, builds, and launches technology solutions for businesses and innovators in Kenya and beyond.",
  keywords: ["innovation", "technology", "software development", "AI solutions", "research"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "TechFlare Solutions",
    description: "IGNITING INNOVATIONS, DELIVERING SOLUTIONS",
    type: "website",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full dark`}>
      <body className="min-h-full flex flex-col antialiased bg-black text-foreground overflow-x-hidden">
        <ThemeProvider>
          <AccessibilityProvider>
            <StatsProvider>
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
