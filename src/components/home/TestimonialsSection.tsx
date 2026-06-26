"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { apiUrl } from "@/lib/api-base";
import { Button } from "@/components/ui/Button";

type Testimonial = {
  id: string;
  authorName: string;
  authorTitle?: string | null;
  authorRole?: string | null;
  company?: string | null;
  content: string;
  rating: number;
};

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(apiUrl("/api/testimonials?limit=10"))
      .then((r) => r.json())
      .then((d) => {
        if (d.testimonials?.length) setItems(d.testimonials);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!loaded || items.length === 0) return null;

  const current = items[index];

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-gold">
            Client Voices
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl">
            What Our <span className="text-gold">Clients Say</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            Real stories from clients and innovators — shared in the portal and approved by our team.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-gold/25 bg-deep-blue/50 p-8 backdrop-blur-md sm:p-12"
            >
              <Quote className="mb-6 h-10 w-10 text-gold/40" />
              <p className="mb-8 text-lg leading-relaxed text-foreground sm:text-xl">
                &ldquo;{current.content}&rdquo;
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gold">{current.authorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {[current.authorTitle, current.company].filter(Boolean).join(" · ")}
                  </p>
                  {current.authorRole && (
                    <span className="mt-1 inline-block rounded-full bg-gold/10 px-2 py-0.5 text-xs capitalize text-gold">
                      {current.authorRole}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {items.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
                className="rounded-full border border-gold/30 p-2 hover:bg-gold/10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-8 bg-gold" : "w-2 bg-gold/30"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % items.length)}
                className="rounded-full border border-gold/30 p-2 hover:bg-gold/10"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button href="/login?redirect=/portal/client/testimonials" variant="outline" size="sm">
              Share your experience
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
