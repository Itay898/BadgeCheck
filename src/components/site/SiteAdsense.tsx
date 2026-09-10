import Script from "next/script";
import { site } from "@/content/site";

/**
 * Google AdSense site code for the editorial routes.
 *
 * Mounted from the (site) layout only, so the assistant (/chat) and the
 * template demo never carry ads. Renders nothing until
 * NEXT_PUBLIC_ADSENSE_CLIENT is set (see src/content/site.ts), which keeps
 * dev, CI and preview builds ad-free by default.
 *
 * With Auto ads switched on in the AdSense dashboard this single script is
 * enough for Google to place ads; <AdSlot> adds fixed manual units on top.
 */
export function SiteAdsense() {
  const client = site.ads.adsenseClient;
  if (!client) return null;
  return (
    <Script
      id="adsbygoogle-init"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
