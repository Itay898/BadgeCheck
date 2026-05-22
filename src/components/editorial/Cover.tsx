import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Article } from "@/content/articles";

type Props = {
  variant: Article["cover"];
  /** Optional real cover image (path under /public). When set, it replaces the gradient pattern. */
  image?: string;
  /** Eager-load with high fetch priority. Use for above-the-fold images (LCP). */
  priority?: boolean;
  className?: string;
  aspect?: "video" | "square" | "wide" | "portrait";
  /** Render with a meaningful label; otherwise the cover is decorative. */
  label?: string;
};

const aspects: Record<NonNullable<Props["aspect"]>, string> = {
  video: "aspect-[16/10]",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  portrait: "aspect-[4/5]",
};

/**
 * Tonal gradient covers — each variant is a distinct, restrained hue from the
 * product palette. No "book cover" patterns, no wordmark stickers — these
 * read as modern placeholders, not collectible art prints.
 *
 * An article may override the gradient with a real `image`.
 */
type CoverStyle = { from: string; to: string; mark: string };

const variants: Record<Article["cover"], CoverStyle> = {
  ribbon: {
    from: "#0F3A52",
    to: "#0B6D7A",
    mark: "rgba(255,255,255,0.10)",
  },
  grid: {
    from: "#1A2030",
    to: "#34384D",
    mark: "rgba(255,255,255,0.08)",
  },
  wave: {
    from: "#13355E",
    to: "#2A6FA3",
    mark: "rgba(255,255,255,0.10)",
  },
  halftone: {
    from: "#2B2E3C",
    to: "#54607A",
    mark: "rgba(255,255,255,0.10)",
  },
  stripe: {
    from: "#10474A",
    to: "#1F7A6E",
    mark: "rgba(255,255,255,0.08)",
  },
  dots: {
    from: "#1F2A52",
    to: "#3F4C8E",
    mark: "rgba(255,255,255,0.10)",
  },
};

export function Cover({
  variant,
  image,
  priority,
  className,
  aspect = "video",
  label,
}: Props) {
  // A real image, when provided, takes precedence over the gradient pattern.
  if (image) {
    return (
      <div
        aria-hidden={label ? undefined : true}
        className={cn(
          "relative overflow-hidden rounded-xl bg-paper-2",
          aspects[aspect],
          className
        )}
      >
        <Image
          src={image}
          alt={label ?? ""}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 720px"
          // Anchor to the top so the crop only ever trims the bottom edge.
          className="object-cover object-top"
        />
      </div>
    );
  }

  const v = variants[variant];
  return (
    <div
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn(
        "relative overflow-hidden rounded-xl",
        aspects[aspect],
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${v.from} 0%, ${v.to} 100%)`,
      }}
    >
      {/* Subtle highlight in the start (RTL: right) corner */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 100% 0%, ${v.mark}, transparent 55%)`,
        }}
      />
      {/* Single hairline arc — calm, geometric, no pattern noise */}
      <svg
        className="absolute inset-0 w-full h-full"
        aria-hidden
        viewBox="0 0 400 250"
        preserveAspectRatio="none"
      >
        <circle
          cx="380"
          cy="-40"
          r="160"
          fill="none"
          stroke={v.mark}
          strokeWidth="1"
        />
        <circle
          cx="380"
          cy="-40"
          r="240"
          fill="none"
          stroke={v.mark}
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
