"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  /**
   * AdSense publisher ID (ca-pub-…). Passed in from a Server Component so the
   * site config module stays out of the client bundle.
   */
  client: string | undefined;
  /** Ad unit ID from the AdSense dashboard (digits only). */
  slot: string | undefined;
  className?: string;
  /** Accessible name for the region; ads are supplementary content. */
  label?: string;
};

/**
 * One responsive AdSense display unit.
 *
 * Renders nothing when the publisher ID or the slot is missing, so pages stay
 * identical in environments without ads. `push()` must run exactly once per
 * <ins> node: the element is keyed on the pathname so sibling-route navigation
 * (/articles/a → /articles/b reuses this component instance) gets a fresh
 * node, and a ref remembers which pathname was already pushed so React Strict
 * Mode's double-invoked effect in dev doesn't push the same node twice.
 */
export function AdSlot({ client, slot, className, label = "פרסומת" }: Props) {
  const pathname = usePathname();
  const pushedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!client || !slot || pushedFor.current === pathname) return;
    pushedFor.current = pathname;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn("[ads] adsbygoogle push failed", error);
    }
  }, [client, slot, pathname]);

  if (!client || !slot) return null;

  return (
    <aside aria-label={label} className={cn("my-10", className)}>
      <ins
        key={pathname}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
