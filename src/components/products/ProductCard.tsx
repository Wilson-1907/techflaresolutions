import { ExternalLink, Rocket, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products, productStatusLabels, type Product, type ProductStatus } from "@/data/site";
import { buildEmailComposeLink } from "@/lib/mailto";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProductStatus, string> = {
  live: "bg-life-green/20 text-life-green border-life-green/30",
  "in-development": "bg-gold/20 text-gold border-gold/30",
  "coming-soon": "bg-white/10 text-muted-foreground border-white/20",
};

const statusIcons: Record<ProductStatus, typeof Sparkles> = {
  live: ExternalLink,
  "in-development": Rocket,
  "coming-soon": Clock,
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const Icon = statusIcons[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide", statusStyles[status])}>
      <Icon className="h-3 w-3" />
      {productStatusLabels[status]}
    </span>
  );
}

export function ProductCardImage({ product }: { product: Product }) {
  if (!product.image) {
    return (
      <div className="mb-4 flex h-44 items-center justify-center rounded-xl bg-gradient-to-br from-deep-blue/80 to-gold/10 border border-gold/10">
        <Sparkles className="h-12 w-12 text-gold/40" />
      </div>
    );
  }

  if (product.image.startsWith("http")) {
    return (
      <div className="relative mb-4 h-44 overflow-hidden rounded-xl border border-gold/15 bg-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title} className="h-full w-full object-cover object-center" />
        {product.status !== "live" && <div className="absolute inset-0 bg-black/30" />}
      </div>
    );
  }

  return (
    <div className="relative mb-4 h-44 overflow-hidden rounded-xl border border-gold/15 bg-black/40">
      <Image
        src={product.image}
        alt={product.title}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {product.status !== "live" && (
        <div className="absolute inset-0 bg-black/30" />
      )}
    </div>
  );
}

export function ProductCardActions({ product }: { product: Product }) {
  if (product.status === "live" && product.externalUrl) {
    return (
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={product.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-gold/20 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/30 transition-colors"
        >
          Launch App <ExternalLink className="h-4 w-4" />
        </a>
        <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 rounded-xl border border-gold/30 px-4 py-2 text-sm hover:bg-gold/10 transition-colors">
          Learn More
        </Link>
      </div>
    );
  }

  if (product.status === "in-development") {
    return (
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 rounded-xl bg-gold/20 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/30">
          Preview & Details
        </Link>
        <a
          href={buildEmailComposeLink({ type: "product", product: product.title })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-gold/30 px-4 py-2 text-sm hover:bg-gold/10"
        >
          Email us
        </a>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 rounded-xl border border-gold/30 px-4 py-2 text-sm hover:bg-gold/10">
        Learn More
      </Link>
      <a
        href={buildEmailComposeLink({ type: "product", product: product.title })}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-gold/20 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/30"
      >
        Email us
      </a>
    </div>
  );
}

export { products };
