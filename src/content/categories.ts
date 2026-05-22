export type Category = {
  slug: string;
  name: string;
  description: string;
  /** Longer on-page intro for the category page — distinct from the meta `description`. */
  intro: string;
  /** Richer <title> for the category page — the bare `name` is too generic for SEO. */
  seoTitle: string;
  /** Editorial accent tone — kept neutral, used as text/border color only */
  tone: "brand" | "amber" | "rose" | "slate";
};

export const categories: Category[] = [
  {
    slug: "guides",
    name: "מדריכים",
    seoTitle: "מדריכים לתו נכה — הגשה, חידוש וחניה",
    description:
      "מדריכים מעשיים, צעד אחר צעד, בשפה ברורה — איך להגיש, איך לחדש, ולמה לצפות.",
    intro:
      "מדריכים מעשיים שמלווים אתכם בכל שלב מול משרד התחבורה — מהגשת בקשה ראשונה, דרך חידוש תו קיים, ועד הבנת הסדרי החניה ביום־יום. כל מדריך כתוב בשפה ברורה ומפנה למקור הרשמי המעודכן.",
    tone: "brand",
  },
  {
    slug: "rights",
    name: "זכויות",
    seoTitle: "זכויות בעלי תו נכה — חניה, הנחות והטבות",
    description: "מה מגיע למחזיק תו נכה, איפה זה כתוב, ואיך עומדים על זה.",
    intro:
      "התו לא מסתכם בחניה. כאן אנחנו מרכזים את הזכויות וההקלות שעשויות להגיע למחזיקי תו — מארנונה ותחבורה ציבורית ועד אגרות — ומסבירים איפה כל אחת נבדקת ומול איזה גוף.",
    tone: "amber",
  },
  {
    slug: "news",
    name: "חדשות",
    seoTitle: "חדשות ועדכוני רגולציה — תו נכה",
    description: "עדכוני רגולציה, החלטות שרי תחבורה, ושינויים בנהלים.",
    intro:
      "עדכוני רגולציה, שינויי נהלים והחלטות שמשפיעים על מחזיקי תו נכה. אנחנו עוקבים אחרי מה שמשתנה — וגם אחרי תופעות שכדאי להכיר, כמו פניות מצדדים שלישיים.",
    tone: "rose",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
