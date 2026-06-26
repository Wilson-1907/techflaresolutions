"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { company } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { EmailLink } from "@/components/ui/EmailLink";
import { buildEmailComposeLink } from "@/lib/mailto";

export function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/20 via-blue-500/10 to-life-green/20 p-12 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">Let&apos;s Build Something Extraordinary</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you have an idea, a problem, or a vision — TechFlare Solutions is ready to partner with you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/login?redirect=/portal/innovation/submit" size="lg">Submit an idea</Button>
              <Button href="/solutions" variant="secondary" size="lg">Solve my problem</Button>
              <Button href={buildEmailComposeLink({ type: "solutions" })} variant="outline" size="lg">
                Email us
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <EmailLink context={{ type: "contact" }} className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                {company.email}
              </EmailLink>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" />{company.phone}</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" />{company.offices[0].city}, {company.offices[0].country}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
