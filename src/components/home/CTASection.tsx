"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { company } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { EmailLink } from "@/components/ui/EmailLink";
import { buildEmailComposeLink } from "@/lib/mailto";

export function CTASection() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-deep-blue-mid via-[#0b1524] to-[#061018] p-10 sm:p-14 text-center"
        >
          <div className="absolute inset-0 mesh-bg opacity-50 pointer-events-none" />
          <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
          <div className="relative">
            <p className="text-cyan-300/90 text-sm font-semibold uppercase tracking-[0.22em] mb-4">
              Partner with TechFlare Solutions
            </p>
            <h2 className="font-display text-3xl font-semibold sm:text-5xl tracking-tight">
              Research. Software. AI. Automation.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Bring an idea, a problem, or a product vision — we design and ship modern technology with
              clarity and care.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button href="/services" size="lg">
                Explore services
              </Button>
              <Button href="/login?redirect=/portal/innovation/submit" variant="secondary" size="lg">
                Submit an idea
              </Button>
              <Button href={buildEmailComposeLink({ type: "solutions" })} variant="outline" size="lg">
                Email us
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <EmailLink context={{ type: "contact" }} className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                {company.email}
              </EmailLink>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                {company.phone}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                {company.offices[0].city}, {company.offices[0].country}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
