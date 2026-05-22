import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { articles, listArticles } from "@/content/articles";
import { categories } from "@/content/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Pages whose content IS the article list (home, archive, category) should
  // report the newest relevant article's date as `lastModified` — a stable,
  // content-driven signal instead of the noisy build timestamp.
  const newestDate = (list: { publishedAt: string }[]): Date =>
    list.length ? new Date(list[0].publishedAt) : now;
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
      lastModified: new Date(a.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
