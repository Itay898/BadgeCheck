import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { articles, listArticles } from "@/content/articles";
import { categories } from "@/content/categories";
import { FAQ_UPDATED_AT } from "@/content/faq";

/**
 * Last substantive content revision for the hand-written static pages, as
 * ISO dates. Google ignores a `lastmod` it decides is unreliable, and using
 * the build timestamp made every deploy claim that /about and /accessibility
 * had changed — so these are maintained by hand alongside their copy.
 *
 * /faq reads its date from the FAQ content module, which is also what the page
 * renders as its visible "עודכן" line: the sitemap and the page should never
 * be able to disagree about how fresh those answers are.
 */
const STATIC_PAGE_UPDATED: Record<string, string> = {
  "/faq": FAQ_UPDATED_AT,
  "/about": "2026-05-22",
  "/accessibility": "2026-05-22",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const stampFor = (path: string): Date =>
    STATIC_PAGE_UPDATED[path] ? new Date(STATIC_PAGE_UPDATED[path]) : now;

  // An article's freshness stamp is its last substantive edit, falling back
  // to the publish date — sitemap freshness should track content, not builds.
  const stampOf = (a: { publishedAt: string; updatedAt?: string }) =>
    a.updatedAt ?? a.publishedAt;

  // Pages whose content IS the article list (home, archive, category) should
  // report the newest relevant article's date as `lastModified` — a stable,
  // content-driven signal instead of the noisy build timestamp.
  const newestDate = (list: { publishedAt: string; updatedAt?: string }[]): Date =>
    list.length ? new Date(list.map(stampOf).sort().at(-1)!) : now;
  const newestArticle = newestDate(listArticles());

  return [
    { url: `${site.url}/`, lastModified: newestArticle, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/articles`, lastModified: newestArticle, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/faq`, lastModified: stampFor("/faq"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/about`, lastModified: stampFor("/about"), changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/accessibility`, lastModified: stampFor("/accessibility"), changeFrequency: "yearly", priority: 0.4 },
    ...categories.map((c) => ({
      url: `${site.url}/category/${c.slug}`,
      lastModified: newestDate(listArticles({ category: c.slug })),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${site.url}/articles/${a.slug}`,
      lastModified: new Date(stampOf(a)),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
