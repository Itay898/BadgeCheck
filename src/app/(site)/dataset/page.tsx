import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { Container } from "@/components/site/Container";
import { SectionHeader } from "@/components/editorial/SectionHeader";
import { BreadcrumbJsonLd } from "@/components/editorial/BreadcrumbJsonLd";
import { JsonLd } from "@/components/site/JsonLd";
import { DATASET_ID, DatasetJsonLd, WEBSITE_ID } from "@/components/site/SiteJsonLd";
import { getDatasetStats } from "@/services/dataset-stats";
import { site, sources } from "@/content/site";

/**
 * Re-read the dataset once a day. The table gains rows continuously (the most
 * recent issue date is usually yesterday), but nothing here moves fast enough
 * to justify a live call per visitor, and CKAN is the kind of dependency you
 * want to lean on gently.
 *
 * This is the only place the window is set. It must stay a literal — Next
 * statically analyses this export and rejects an imported constant — and the
 * fetches in `dataset-stats` deliberately set no `revalidate` of their own, so
 * they inherit this one instead of silently shortening it.
 */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: { absolute: "מאגר תווי הנכה במספרים - כמה תגים יש בישראל | תו צ׳ק" },
  description:
    "כמה רכבים רשומים היום עם תג חניה לנכה בישראל, איך הם מתחלקים לפי סוג תג, ומאיזה טווח תאריכים. נתונים שנקראים ישירות ממאגר משרד התחבורה ומתעדכנים מדי יום.",
  alternates: { canonical: "/dataset" },
};

const numberFormatter = new Intl.NumberFormat("he-IL");
const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(iso: string | null): string | null {
  return iso ? dateFormatter.format(new Date(iso)) : null;
}

export default async function DatasetStatsPage() {
  const stats = await getDatasetStats();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.url}/dataset#page`,
    name: "מאגר תווי הנכה במספרים",
    url: `${site.url}/dataset`,
    inLanguage: "he",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": DATASET_ID },
    ...(stats ? { dateModified: stats.readAt.slice(0, 10) } : {}),
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <DatasetJsonLd />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "ראשי", path: "/" },
          { name: "המאגר במספרים", path: "/dataset" },
        ]}
      />

      {/* HEAD */}
      <header className="pt-10 sm:pt-14 pb-8 border-b border-border">
        <Container size="narrow">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
            <Database size={12} aria-hidden />
            נקרא ישירות מ-data.gov.il
          </p>
          <h1 className="mt-4 text-[34px] sm:text-[44px] font-bold leading-tight tracking-tight">
            מאגר תווי הנכה במספרים
          </h1>
          <p className="mt-3 text-[16px] text-muted-foreground leading-relaxed max-w-[58ch]">
            כמה רכבים רשומים היום עם תג חניה לנכה, איך הם מתחלקים, ומאיזה טווח
            תאריכים. הנתונים נקראים ישירות מהמאגר הציבורי של משרד התחבורה
            ומתרעננים מדי יום.
          </p>
        </Container>
      </header>

      <div className="py-10 sm:py-14">
        <Container size="narrow">
          {stats ? (
            <>
              {/* HEADLINE NUMBER */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  רכבים המשויכים לתג חניה לנכה
                </p>
                <p className="mt-3 text-[46px] sm:text-[62px] font-bold leading-none tracking-tight tabular-nums text-brand">
                  {numberFormatter.format(stats.total)}
                </p>
                {formatDate(stats.readAt.slice(0, 10)) && (
                  <p className="mt-3 text-[13.5px] text-muted-foreground">
                    נכון ל־
                    <time dateTime={stats.readAt.slice(0, 10)}>
                      {formatDate(stats.readAt.slice(0, 10))}
                    </time>
                  </p>
                )}
              </div>

              {/* BY TYPE */}
              <section className="mt-12">
                <SectionHeader
                  eyebrow="לפי סוג תג"
                  title="שני קודים, חלוקה לא שוויונית"
                  description="המאגר מפרסם את סוג התג כקוד מספרי, בלי מקרא שמסביר מה כל קוד מייצג."
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  {stats.byType.map((t) => (
                    <div
                      key={t.code}
                      className="rounded-2xl border border-border bg-card p-5"
                    >
                      <p className="text-[13px] font-semibold text-muted-foreground">
                        סוג תג {t.code}
                      </p>
                      <p className="mt-2 text-[30px] font-bold leading-none tracking-tight tabular-nums">
                        {numberFormatter.format(t.count)}
                      </p>
                      <div
                        className="mt-3 h-1.5 rounded-full bg-foreground/[0.08] overflow-hidden"
                        role="presentation"
                      >
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${Math.max(t.share * 100, 1)}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[13.5px] text-muted-foreground tabular-nums">
                        {(t.share * 100).toFixed(1)}% מהרשומות
                      </p>
                    </div>
                  ))}
                </div>

                <div className="not-prose mt-6 rounded-xl border border-border bg-paper-2 p-4 sm:p-5 text-[14.5px] leading-relaxed text-foreground/85">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-strong mb-1">
                    לתשומת לב
                  </span>
                  ידוע שקיימים כמה סוגי תגים - בין היתר תג רגיל ותג לנכה המוגבל
                  בהליכה וזקוק לכיסא גלגלים. עם זאת, המאגר עצמו אינו מפרסם מקרא
                  שמקשר בין הקוד לבין סוג התג, ולכן לא נצמיד כאן שם לכל קוד.
                  היחס בין השניים עקבי עם ההבחנה הזו, אבל התאמה היא לא אותו דבר
                  כמו תיעוד.
                </div>
              </section>

              {/* DATE RANGE */}
              {(stats.earliestIssue || stats.latestIssue) && (
                <section className="mt-12">
                  <SectionHeader
                    eyebrow="טווח התאריכים"
                    title="מאיפה עד איפה"
                    description="תאריך ההפקה של התג הוותיק ביותר ושל החדש ביותר שמופיעים כרגע במאגר."
                  />
                  <dl className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "ההפקה הוותיקה ביותר", value: stats.earliestIssue },
                      { label: "ההפקה האחרונה", value: stats.latestIssue },
                    ]
                      .filter((r) => r.value)
                      .map((r) => (
                        <div
                          key={r.label}
                          className="rounded-2xl border border-border bg-card p-5"
                        >
                          <dt className="text-[13px] font-semibold text-muted-foreground">
                            {r.label}
                          </dt>
                          <dd className="mt-2 text-[22px] font-bold tracking-tight">
                            <time dateTime={r.value!}>{formatDate(r.value)}</time>
                          </dd>
                        </div>
                      ))}
                  </dl>
                  <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
                    ההפקה האחרונה היא בדרך כלל מהימים האחרונים, וזו העדות
                    המעשית לכך שהמאגר מתעדכן בתדירות גבוהה. זו גם הסיבה שתג
                    שחודש אתמול לא תמיד מופיע היום.
                  </p>
                </section>
              )}

              {stats.mayBeIncomplete && (
                <p className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-[14.5px] leading-relaxed">
                  שימו לב: זוהה במאגר קוד סוג תג שאינו מוכר לנו, ולכן הסכום
                  שמוצג כאן עשוי להיות חלקי. הנתון המלא נמצא תמיד בעמוד המאגר
                  הרשמי.
                </p>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-paper-2 p-6 sm:p-8">
              <h2 className="text-xl font-bold tracking-tight">
                הנתונים אינם זמינים כרגע
              </h2>
              <p className="mt-3 text-[15.5px] text-muted-foreground leading-relaxed">
                לא הצלחנו לקרוא את המאגר של data.gov.il ברגע זה. זו כמעט תמיד
                תקלה זמנית בצד השרת של המאגר. אפשר לנסות שוב מאוחר יותר, או
                לעיין בנתונים ישירות בעמוד המאגר הרשמי.
              </p>
            </div>
          )}

          {/* WHAT THIS MEANS */}
          <section className="mt-14 prose-he">
            <h2>למה המספרים האלה מעניינים</h2>
            <p>
              היקף התגים בישראל היה בשנים האחרונות נושא לדיון ציבורי, לחקירת
              משטרה ולהצעות לשינוי מנגנון הזכאות. רוב הדיון הזה מצטט מספרים
              ממקור שני. העמוד הזה פשוט קורא את המאגר.
            </p>
            <p>
              חשוב לקרוא אותם נכון: כל שורה במאגר היא שיוך בין תג לבין מספר רכב,
              לא בהכרח אדם. מחזיק תג יכול לשייך יותר מרכב אחד, ולכן מספר השורות
              אינו זהה למספר בעלי התגים. זו הסתייגות שכדאי לזכור בכל פעם
              שמצטטים מספר כזה, כולל כאן.
            </p>
            <h2>מה עוד יש במאגר</h2>
            <p>
              שלושה שדות בלבד: מספר רכב, תאריך הפקת התג וסוג התג. אין בו שמות,
              אין מספרי זהות ואין תאריך תפוגה - ולכן בדיקה ציבורית יכולה להגיד
              אם קיים רישום, אבל לא עד מתי הוא בתוקף.
            </p>
          </section>

          {/* LINKS OUT */}
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/#check"
              className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-5 h-11 text-sm font-semibold hover:bg-brand-strong transition-colors shadow-[var(--elev-1)]"
            >
              לבדיקת רכב ספציפי
              <ArrowLeft size={16} />
            </Link>
            <Link
              href="/articles/tav-nikkeh-public-dataset"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 h-11 text-sm font-semibold hover:bg-paper-2 transition-colors"
            >
              מה בדיוק יש במאגר
            </Link>
            <a
              href={sources.datasetResource}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 h-11 text-sm font-semibold hover:bg-paper-2 transition-colors"
            >
              המאגר הרשמי ב-data.gov.il
            </a>
          </div>
        </Container>
      </div>
    </>
  );
}
