import type { Article, ArticleBlock } from "@/content/articles";
import { listArticles } from "@/content/articles";
import { getCategory } from "@/content/categories";
import { faqSections } from "@/content/faq";
import { site, sources } from "@/content/site";

/**
 * /llms-full.txt — the whole site as one plain-text document.
 *
 * The companion to /llms.txt: that file is a map, this one is the territory.
 * An assistant that fetches this has every article body, every FAQ answer and
 * every source link without crawling 21 URLs — and without wading through the
 * RSC payload that doubles the weight of the rendered pages.
 *
 * Rendered from the same `ArticleBlock` union the pages render, so a new block
 * type is a compile error here rather than silently missing content.
 */
export const dynamic = "force-static";

/** One article block as plain markdown-ish text. */
function renderBlock(block: ArticleBlock): string {
  switch (block.type) {
    case "p":
      return block.text;
    case "h2":
      return `## ${block.text}`;
    case "h3":
      return `### ${block.text}`;
    case "ul":
      return block.items.map((item) => `- ${item}`).join("\n");
    case "quote":
      return block.cite ? `> ${block.text}\n> - ${block.cite}` : `> ${block.text}`;
    case "callout":
      return `**לתשומת לב:** ${block.text}`;
  }
}

function renderArticle(article: Article): string {
  const category = getCategory(article.category);
  const parts: string[] = [];

  parts.push(`# ${article.title}`);
  parts.push("");
  parts.push(`URL: ${site.url}/articles/${article.slug}`);
  if (category) parts.push(`קטגוריה: ${category.name}`);
  parts.push(`פורסם: ${article.publishedAt}`);
  if (article.updatedAt && article.updatedAt !== article.publishedAt) {
    parts.push(`עודכן: ${article.updatedAt}`);
  }
  parts.push("");
  parts.push(article.dek);
  parts.push("");
  parts.push(article.body.map(renderBlock).join("\n\n"));

  if (article.citations?.length) {
    parts.push("");
    parts.push("### מקורות");
    parts.push("");
    parts.push(article.citations.map((c) => `- ${c.name}: ${c.url}`).join("\n"));
  }

  return parts.join("\n");
}

function buildLlmsFullTxt(): string {
  const parts: string[] = [];

  parts.push(`# ${site.name} - ${site.tagline}`);
  parts.push("");
  parts.push(site.description);
  parts.push("");
  parts.push(
    "מסמך זה מרכז את כל תוכן האתר בקובץ אחד. האתר הוא פרויקט עצמאי ואינו אתר ממשלתי; הנהלים והתנאים נקבעים על ידי משרד התחבורה ועשויים להשתנות.",
  );
  parts.push("");
  parts.push("---");
  parts.push("");

  parts.push("# שאלות נפוצות");
  parts.push("");
  for (const section of faqSections) {
    parts.push(`## ${section.title}`);
    if (section.intro) {
      parts.push("");
      parts.push(section.intro);
    }
    parts.push("");
    for (const entry of section.entries) {
      parts.push(`### ${entry.question}`);
      parts.push("");
      parts.push(entry.answer.join("\n\n"));
      if (entry.list?.length) {
        parts.push("");
        parts.push(entry.list.map((item) => `- ${item}`).join("\n"));
      }
      if (entry.source) {
        parts.push("");
        parts.push(`למקור: ${entry.source}`);
      }
      parts.push("");
    }
  }

  parts.push("---");
  parts.push("");

  for (const article of listArticles()) {
    parts.push(renderArticle(article));
    parts.push("");
    parts.push("---");
    parts.push("");
  }

  parts.push("# מקורות רשמיים");
  parts.push("");
  parts.push(`- מאגר "כלי רכב עם תג חניה לנכה" - data.gov.il: ${sources.datasetResource}`);
  parts.push(`- הגשת בקשה לקבלת תג חניה לנכה - משרד התחבורה: ${sources.ministryService}`);
  parts.push(`- כלי רכב המשוייכים לתג נכה - משרד התחבורה: ${sources.ministryLookup}`);
  parts.push(`- תג חנייה לנכה - המוסד לביטוח לאומי: ${sources.nationalInsurance}`);
  parts.push(`- חוק חניה לנכים, התשנ"ד-1993: ${sources.parkingLaw}`);
  parts.push("");

  return parts.join("\n");
}

export function GET(): Response {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
