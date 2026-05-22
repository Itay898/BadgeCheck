import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  /** Hide the wordmark on very small viewports (<sm). Only the mark stays. */
  compactOnMobile?: boolean;
};

/**
 * Modern logomark: a brand-tile with the Hebrew "ת" + a small accent dot that
 * reads as a verification check, paired with a sans wordmark. No serif anywhere.
 */
export function SiteLogo({ className, compactOnMobile = false }: SiteLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 leading-none",
        className
      )}
      aria-label="תו צ׳ק"
    >
      <span
        aria-hidden
        className="relative inline-grid place-items-center h-8 w-8 rounded-lg bg-foreground text-background text-[16px] font-extrabold"
      >
        ת
        <span className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-brand ring-2 ring-background" />
      </span>
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
