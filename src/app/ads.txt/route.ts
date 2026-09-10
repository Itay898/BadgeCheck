import { site } from "@/content/site";

export const dynamic = "force-static";

/**
 * ads.txt for AdSense (IAB Authorized Digital Sellers). Derived from the
 * configured publisher ID so it can never drift from the tag; 404 until ads
 * are configured. Google's seller line uses the bare pub-… ID (no "ca-").
 */
export function GET() {
  const client = site.ads.adsenseClient;
  if (!client) return new Response("Not found", { status: 404 });
  const publisherId = client.replace(/^ca-/, "");
  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
