"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  slug: string;
  title: string;
  description: string;
  image: string;
  delay?: number;
  variant?: "compact" | "wide";
  href?: string;
}

export function ServiceCard({
  slug,
  title,
  description,
  image,
  delay = 0,
  variant = "compact",
  href,
}: ServiceCardProps) {
  const isWide = variant === "wide";

  const card = (
    <motion.div
      data-service={slug}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gold/15",
        "transition-colors hover:border-gold/40",
        isWide ? "min-h-[200px]" : "min-h-[240px] h-full"
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
        <h3 className={cn("font-semibold text-white", isWide ? "text-xl font-bold" : "text-base")}>
          {title}
        </h3>
        <p className={cn("mt-2 text-muted-foreground", isWide ? "text-base max-w-xl" : "text-sm")}>
          {description}
        </p>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {card}
      </Link>
    );
  }

  return card;
}