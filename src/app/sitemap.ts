import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { articles, listArticles } from "@/content/articles";
import { categories } from "@/content/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
    { url: `${site.url}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
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
