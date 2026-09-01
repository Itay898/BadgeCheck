import Link from "next/link";
import { ArrowLeft, Sparkles, Database } from "lucide-react";
import { Container } from "@/components/site/Container";
import { BadgeCheckWidget } from "@/components/tool/BadgeCheckWidget";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { SectionHeader } from "@/components/editorial/SectionHeader";
import { HowItWorks } from "@/components/editorial/HowItWorks";
import { WhoFor } from "@/components/editorial/WhoFor";
import { listArticles, getFeatured } from "@/content/articles";
import { categories } from "@/content/categories";
import { site } from "@/content/site";

export default function HomePage() {
  const featured = getFeatured();
  const latest = listArticles({ limit: 3, excludeSlug: featured?.slug });

  // WebApplication schema — the badge checker is a real, free web tool.
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${site.name} — בדיקת תו נכה`,
    url: site.url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    inLanguage: "he",
    offers: { "@type": "Offer", price: "0", priceCurrency: "ILS" },
    description: site.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />

      {/* HERO + CHECK WIDGET */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-border">
        <Container>
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
            {/* Hero copy — visible second on mobile, first at lg+ */}
            <div className="order-2 lg:order-1 lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
                <Database size={12} aria-hidden />
                מבוסס על data.gov.il
              </p>
              <h1 className="mt-5 text-[34px] sm:text-[46px] lg:text-[54px] leading-[1.08] font-bold tracking-tight">
                בדיקת <span className="text-brand">תו נכה</span> לפי מספר רכב — חינם וללא הרשמה
              </h1>
              <p className="mt-5 text-[17px] sm:text-lg text-muted-foreground leading-relaxed max-w-[58ch]">
                מזינים מספר רכב, ואנחנו בודקים בזמן אמת מול מאגר המידע הציבורי
                של ממשלת ישראל. לצד הכלי — מבט מסודר על התהליך, הזכויות והכללים.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#check"
                  className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-5 h-12 text-sm font-semibold hover:bg-brand-strong transition-colors shadow-[var(--elev-1)]"
                >
                  בדיקת תו עכשיו
                  <ArrowLeft size={16} />
                </Link>
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 h-12 text-sm font-semibold text-foreground hover:bg-paper-2 transition-colors"
                >
                  קראו את הכתבות
                </Link>
              </div>
            </div>

            {/* Checker — first on mobile so it's above the fold, right side at lg+ */}
            <div
              id="check"
              className="order-1 lg:order-2 lg:col-span-5 scroll-mt-24"
            >
              <BadgeCheckWidget />
            </div>
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 sm:py-16 border-b border-border bg-paper-2">
        <Container>
          <SectionHeader
            eyebrow="איך זה עובד"
            title="שלושה שלבים. אפס נתונים שמורים"
            description="הבדיקה רצה ישירות מול המקור הציבורי. אנחנו לא שומרים את מספר הרכב, לא דורשים הרשמה ולא משייכים את הבדיקה לזהותכם."
          />
          <HowItWorks />
        </Container>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-[var(--section-pad-y)] border-b border-border">
        <Container>
          <SectionHeader
            eyebrow="למי ולמה"
            title="מתי כדאי לבדוק תו"
            description="תוקף תו נכה הוא מידע ציבורי, אבל הוא יושב במאגר נתונים שלא נבנה לבדיקה מהירה. הכלי מצמצם את זה לתשובה אחת ברורה — בלי הרשמה, בלי התקנה, ובלי לשמור את מספר הרכב."
          />
          <WhoFor />
        </Container>
      </section>

      {/* POPULAR ANSWERS — plain text links push authority to the key guides */}
      <section className="py-12 sm:py-16 border-b border-border bg-paper-2">
        <Container>
          <SectionHeader
            eyebrow="קיצורי דרך"
            title="התשובות המבוקשות ביותר"
            description="המדריכים שעונים על השאלות שהכי הרבה אנשים מגיעים איתן."
          />
          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
            {[
              { href: "/articles/how-to-check-tav-nikkeh-online", label: "איך בודקים תו נכה לפי מספר רכב?" },
              { href: "/articles/check-tav-nikkeh-by-id-number", label: "אפשר לבדוק תו נכה לפי תעודת זהות?" },
              { href: "/articles/ministry-personal-area-guide", label: "איפה בודקים סטטוס, תוקף וחידוש מול משרד התחבורה?" },
              { href: "/articles/tav-nikkeh-public-dataset", label: "מה יש במאגר תווי הנכה — ומתי הוא מתעדכן?" },
              { href: "/articles/parking-permit-vs-tav-nikkeh", label: "מה ההבדל בין תו נכה, תג נכה ותו חניה עירוני?" },
              { href: "/articles/blue-square-rules-2026", label: "איפה מותר לחנות עם תו? כללי הריבוע הכחול" },
              { href: "/articles/what-tav-nikkeh-actually-gives-you", label: "מה התו מאפשר מעבר לחניה?" },
              { href: "/faq", label: "כל השאלות הנפוצות על תו נכה" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-center gap-2 text-[15.5px] font-medium text-foreground/85 hover:text-brand-strong transition-colors"
                >
                  <ArrowLeft
                    size={15}
                    aria-hidden
                    className="text-brand shrink-0 transition-transform group-hover:-translate-x-0.5"
                  />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="py-[var(--section-pad-y)]">
          <Container>
            <SectionHeader
              eyebrow="כתבה מומלצת"
              title="להתחיל מכאן"
              link={{ href: "/articles", label: "לכל הכתבות" }}
            />
            <ArticleCard article={featured} variant="featured" />
          </Container>
        </section>
      )}

      {/* LATEST GRID */}
      <section className="py-[var(--section-pad-y)] border-t border-border bg-paper-2">
        <Container>
          <SectionHeader
            eyebrow="עדכונים אחרונים"
            title="פורסם לאחרונה"
            description="מדריכים, חדשות וזכויות — מה שיצא לאחרונה במערכת."
            link={{ href: "/articles", label: "לכל הכתבות" }}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latest.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="default" />
            ))}
          </div>
        </Container>
      </section>

      {/* CATEGORIES NAVIGATOR */}
      <section className="py-[var(--section-pad-y)] border-t border-border">
        <Container>
          <SectionHeader eyebrow="לפי קטגוריה" title="ניווט מהיר בתוכן" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categories.map((c) => {
              const count = listArticles({ category: c.slug }).length;
              return (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="group flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card hover:shadow-[var(--elev-2)] transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[17px] font-bold tracking-tight group-hover:text-brand-strong transition-colors">
                      {c.name}
                    </h3>
                    <span
                      aria-label={`${count} כתבות`}
                      className="inline-flex items-center justify-center min-w-[1.75rem] h-6 rounded-full bg-foreground/[0.06] px-1.5 text-[11.5px] font-semibold text-foreground/70 tabular-nums"
                    >
                      {count}
                    </span>
                  </div>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    {c.description}
                  </p>
                  <span
                    aria-hidden
                    className="mt-auto inline-flex items-center gap-1 text-[13px] font-semibold text-brand group-hover:text-brand-strong transition-colors"
                  >
                    לעיון בקטגוריה
                    <span className="transition-transform group-hover:-translate-x-0.5">‹</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* AI ASSISTANT CTA */}
      <section className="py-[var(--section-pad-y)] border-t border-border">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-7 sm:p-10">
            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-strong text-[11.5px] font-semibold py-1 px-2.5">
                  <Sparkles size={12} aria-hidden /> עוזר חכם
                </p>
                <h2 className="mt-3 text-2xl sm:text-[28px] font-bold leading-tight tracking-tight">
                  לא בטוחים מה לבדוק? יש לנו עוזר חכם
                </h2>
                <p className="mt-2 text-[15px] text-muted-foreground max-w-[55ch] leading-relaxed">
                  שאלו אותו בשפה חופשית — על זכאות, על מסמכים או על נהלים — והוא
                  יחזיר תשובה ממוקדת עם הפניות לכתבות המתאימות.
                </p>
              </div>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-6 h-12 text-sm font-semibold hover:bg-brand-strong transition-colors shadow-[var(--elev-1)] whitespace-nowrap"
              >
                פתח את העוזר
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
