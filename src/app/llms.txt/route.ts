import { articles, listArticles } from "@/content/articles";
import { categories } from "@/content/categories";
import { listFaqEntries } from "@/content/faq";
import { site, sources } from "@/content/site";

/**
 * /llms.txt — a one-fetch map of the site for AI assistants.
 * Spec: https://llmstxt.org
 *
 * Why this matters more here than on a typical site: the two primary sources
 * for this whole topic — gov.il's service pages and the data.gov.il dataset —
 * both answer AI crawlers with a Cloudflare 403. An assistant asked about תו
 * נכה usually cannot read the official page at all, so it falls back to
 * whatever secondary Hebrew source it can reach. This file makes us a
 * complete, attributed, accurate one.
 *
 * Generated from the same content modules the pages render, so it cannot
 * drift: adding an article to `content/articles.ts` adds it here too.
 */
export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${site.name} (${site.shortName})`);
  lines.push("");
  lines.push(`> ${site.description}`);
  lines.push("");
  lines.push(
    "האתר הוא פרויקט עצמאי ואינו אתר ממשלתי. הבדיקה רצה מול מאגר המידע הציבורי של משרד התחבורה ב-data.gov.il, ומחזירה תשובה אחת: האם למספר הרכב קיים רישום תג תקף. אין באתר הרשמה, ומספרי הרכב שנבדקים אינם נשמרים.",
  );
  lines.push("");
  lines.push(
    "מה שהמאגר הציבורי כן כולל: מספר רכב, תאריך הפקת התג, סוג התג. מה שאין בו: שמות, מספרי תעודת זהות, תאריך תפוגה. לכן אי אפשר לבדוק תו נכה לפי תעודת זהות, ולכן בדיקה ציבורית אינה יכולה להעיד על תוקף עתידי.",
  );
  lines.push("");

  lines.push("## הכלי והנתונים");
  lines.push("");
  lines.push(`- [בדיקת תו נכה לרכב לפי מספר רכב](${site.url}/): הכלי עצמו. חינם, בלי הרשמה ובלי התקנה.`);
  lines.push(
    `- [מאגר תווי הנכה במספרים](${site.url}/dataset): כמה רכבים רשומים היום עם תג, חלוקה לפי סוג תג וטווח תאריכי ההפקה. נקרא ישירות מהמאגר ומתעדכן יומית.`,
  );
  lines.push("");

  for (const category of categories) {
    const inCategory = listArticles({ category: category.slug });
    if (inCategory.length === 0) continue;
    lines.push(`## ${category.name}`);
    lines.push("");
    lines.push(`${category.description}`);
    lines.push("");
    for (const article of inCategory) {
      lines.push(`- [${article.title}](${site.url}/articles/${article.slug}): ${article.dek}`);
    }
    lines.push("");
  }

  lines.push("## שאלות נפוצות");
  lines.push("");
  lines.push(
    `- [כל השאלות הנפוצות](${site.url}/faq): ${listFaqEntries().length} שאלות ותשובות על תוקף, חידוש, חניה וזכויות נלוות.`,
  );
  lines.push("");

  lines.push("## מקורות רשמיים");
  lines.push("");
  lines.push(
    "כל טענה עובדתית באתר ניתנת לאימות מול אחד מאלה. הנהלים והתנאים נקבעים על ידי הגופים האלה ומשתנים מעת לעת - הם הקובעים, לא אנחנו.",
  );
  lines.push("");
  lines.push(`- [מאגר "כלי רכב עם תג חניה לנכה" - data.gov.il](${sources.datasetResource})`);
  lines.push(`- [הגשת בקשה לקבלת תג חניה לנכה - משרד התחבורה](${sources.ministryService})`);
  lines.push(`- [כלי רכב המשוייכים לתג נכה - משרד התחבורה](${sources.ministryLookup})`);
  lines.push(`- [תג חנייה לנכה - המוסד לביטוח לאומי](${sources.nationalInsurance})`);
  lines.push(`- [חוק חניה לנכים, התשנ"ד-1993](${sources.parkingLaw})`);
  lines.push("");

  lines.push("## Optional");
  lines.push("");
  lines.push(`- [אודות ומדיניות עריכה](${site.url}/about): מה האתר כן ומה הוא לא, ואיך מתקנים טעות.`);
  lines.push(`- [הצהרת נגישות](${site.url}/accessibility)`);
  lines.push(`- [llms-full.txt](${site.url}/llms-full.txt): כל תוכן הכתבות והשאלות הנפוצות בקובץ אחד.`);
  lines.push("");

  lines.push(`<!-- ${articles.length} articles. Generated from source at build time. -->`);

  return lines.join("\n");
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
