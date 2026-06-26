import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { BrandIdentitySection } from "@/components/about/BrandIdentitySection";

export const metadata: Metadata = {
  title: "Brand Identity",
  description: "TechFlare Solutions logo symbolism and brand meaning.",
  robots: { index: false, follow: false },
};

export default function BrandAboutPage() {
  return (
    <>
      <PageHeader
        title="Brand Identity"
        subtitle="Logo symbolism and meaning — internal reference"
        badge="Brand"
      />

      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <BrandIdentitySection />
          <p className="mt-12 text-center text-sm text-muted-foreground">
            <Link href="/about" className="text-gold hover:underline">
              ← Back to About
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
