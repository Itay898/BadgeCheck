import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * AI crawlers were already allowed here — they simply fell through the `*`
 * group. Naming them makes that a decision rather than an accident, and it is
 * the decision we want: the official sources for this topic (gov.il,
 * data.gov.il) answer these same bots with a Cloudflare 403, so an assistant
 * answering a question about תו נכה cannot read the primary source. Being
 * readable is how an accurate, attributed answer reaches the person asking.
 *
 * `ChatGPT-User` and `Perplexity-User` are the fetch-on-behalf-of-a-user
 * agents rather than index crawlers; they are listed for the same reason.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
