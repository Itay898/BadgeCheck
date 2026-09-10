import { GoogleAnalytics } from "@next/third-parties/google";
import { site } from "@/content/site";

/**
 * Google Analytics 4 for every route.
 *
 * Loads when:
 *  - NEXT_PUBLIC_GA_ID is set explicitly (any environment — e.g. a dev session
 *    watching GA DebugView, or a staging host with its own property), or
 *  - this is a production build that knows its public URL. `next start` on a
 *    laptop without NEXT_PUBLIC_SITE_URL is still NODE_ENV=production, so the
 *    localhost fallback in `site.url` is what keeps smoke tests of a prod build
 *    out of the production property.
 *
 * Route changes: @next/third-parties only fires `gtag('config')` once on mount
 * and does not re-send on App Router navigations. Per-page views after the
 * landing page rely on the GA4 stream's Enhanced Measurement option "Page
 * changes based on browser history events" (on for G-YX84RQZ89Y, verified
 * 2026-09-10). If that toggle is ever switched off, only the first page of each
 * session will be counted.
 *
 * Privacy: page views only — no plate numbers reach GA. The check runs through
 * a fetch to /api/check and GA records the document URL, never fetch URLs, so
 * the "we don't keep the plates you check" promise on /about and in the FAQ
 * holds.
 */
export function SiteAnalytics() {
  const gaId = site.analytics.gaMeasurementId;
  if (!gaId) return null;

  const optedIn = Boolean(process.env.NEXT_PUBLIC_GA_ID?.trim());
  const isProductionBuild = process.env.NODE_ENV === "production";
  const knowsPublicUrl = new URL(site.url).hostname !== "localhost";
  if (!optedIn && !(isProductionBuild && knowsPublicUrl)) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
