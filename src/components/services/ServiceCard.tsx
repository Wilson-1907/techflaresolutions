"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  slug: string;
  title: string;
  description: string;
  image: string;
  delay?: number;
  variant?: "compact" | "wide";
  href?: string;
  approach?: string[];
  tools?: string[];
  expandable?: boolean;
  defaultExpanded?: boolean;
}

export function ServiceCard({
  slug,
  title,
  description,
  image,
  delay = 0,
  variant = "compact",
  href,
  approach = [],
  tools = [],
  expandable = false,
  defaultExpanded = false,
}: ServiceCardProps) {
  const isWide = variant === "wide";
  const hasDetails = expandable && (approach.length > 0 || tools.length > 0);
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    setExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const toggle = () => {
    if (hasDetails) setExpanded((v) => !v);
  };

  const cardFace = (
    <motion.div
      data-service={slug}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hasDetails ? undefined : { y: -4 }}
      onClick={hasDetails ? toggle : undefined}
      onKeyDown={
        hasDetails
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            }
          : undefined
      }
      role={hasDetails ? "button" : undefined}
      tabIndex={hasDetails ? 0 : undefined}
      aria-expanded={hasDetails ? expanded : undefined}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gold/15",
        "transition-colors hover:border-gold/40",
        hasDetails && "cursor-pointer",
        isWide ? "min-h-[200px]" : "min-h-[240px] h-full",
        hasDetails && expanded && "rounded-b-none border-b-0"
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes={isWide ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-deep-blue/50" />
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div
        className={cn(
          "relative z-10 flex h-full flex-col justify-end p-6",
          isWide && "sm:p-8"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className={cn("font-semibold text-white", isWide ? "text-xl font-bold" : "text-base")}>
            {title}
          </h3>
          {hasDetails && (
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-gold transition-transform duration-300",
                expanded && "rotate-180"
              )}
            />
          )}
        </div>
        <p className={cn("mt-2 text-muted-foreground", isWide ? "text-base max-w-xl" : "text-sm")}>
          {description}
        </p>
        {hasDetails && !expanded && (
          <p className="mt-3 text-xs text-gold/90">Tap to see how we solve this →</p>
        )}
      </div>
    </motion.div>
  );

  const detailsPanel = (
    <AnimatePresence initial={false}>
      {hasDetails && expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-b-2xl border border-t-0 border-gold/15 bg-deep-blue/90"
        >
          <div className="space-y-5 px-6 py-5 sm:px-8">
            {approach.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gold mb-3">How we handle it</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  {approach.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {tools.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gold mb-3">
                  <Wrench className="h-4 w-4" />
                  Tools &amp; stack we use
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs text-foreground"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (hasDetails) {
    return (
      <div className="h-full">
        {cardFace}
        {detailsPanel}
      </div>
    );
  }

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardFace}
      </Link>
    );
  }

  return cardFace;
}
