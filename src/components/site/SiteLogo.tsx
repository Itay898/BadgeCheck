import { cn } from "@/lib/utils";
import {
  MARK_BRAND,
  MARK_CARD,
  MARK_CHECK,
  MARK_CHECK_WIDTH,
  MARK_RADIUS,
} from "@/content/mark";

type SiteLogoProps = {
  className?: string;
  /** Hide the wordmark on very small viewports (<sm). Only the mark stays. */
  compactOnMobile?: boolean;
};

/**
 * Logomark + wordmark. The mark is the shared artwork from `@/content/mark`,
 * so the header tile, the favicon and the OG card are literally the same paths.
 *
 * The whole lockup carries one `aria-label`, and the SVG is hidden from the
 * accessibility tree, so a screen reader announces the brand once rather than
 * narrating the drawing.
 */
export function SiteLogo({ className, compactOnMobile = false }: SiteLogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5 leading-none", className)}
      aria-label="תו צ׳ק"
    >
      <svg
        aria-hidden
        viewBox="0 0 512 512"
        className="h-8 w-8 shrink-0"
        role="presentation"
      >
        <rect width="512" height="512" rx={MARK_RADIUS} fill={MARK_BRAND} />
        <path fill="#FFFFFF" fillRule="evenodd" d={MARK_CARD} />
        <path
          d={MARK_CHECK}
          fill="none"
          stroke={MARK_BRAND}
          strokeWidth={MARK_CHECK_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          "font-bold text-[17px] tracking-tight",
          compactOnMobile && "hidden min-[360px]:inline"
        )}
      >
        תו צ׳ק
      </span>
    </span>
  );
}
