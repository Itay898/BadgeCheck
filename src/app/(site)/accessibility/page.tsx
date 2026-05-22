import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/Container";
import { ArrowLeft } from "lucide-react";
import { site } from "@/content/site";
import { BreadcrumbJsonLd } from "@/components/editorial/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description:
    "מחויבות הנגישות שלנו, מה כבר נעשה, מה בעבודה, ואיך לפנות אלינו בנושאי נגישות.",
  alternates: { canonical: "/accessibility" },
};

// Bump this manually when the accessibility statement is meaningfully revised.
const LAST_REVIEWED_AT = "2026-05-15";

const lastReviewedFmt = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function AccessibilityPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "ראשי", path: "/" },
          { name: "הצהרת נגישות", path: "/accessibility" },
        ]}
      />
      <header className="pt-10 sm:pt-14 pb-8 border-b border-border">
        <Container size="narrow">
          <nav
            aria-label="פירורי לחם"
            className="text-xs text-muted-foreground mb-5"
          >
            <ol className="flex items-center gap-1.5">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  ראשי
                </Link>
              </li>
              <li aria-hidden>‹</li>
              <li className="text-foreground/70">הצהרת נגישות</li>
            </ol>
          </nav>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
            נגישות
          </p>
          <h1 className="mt-4 text-[32px] sm:text-[42px] font-bold leading-tight tracking-tight">
            הצהרת נגישות
          </h1>
          <p className="mt-3 text-[16px] text-muted-foreground leading-relaxed">
            {site.name} מחויב לנגישות עבור כל המשתמשים. הדף הזה מתאר את מצב
            הנגישות הנוכחי של האתר, מה כבר נעשה ומה עוד בעבודה.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            עודכן לאחרונה:{" "}
            <time dateTime={LAST_REVIEWED_AT}>
              {lastReviewedFmt.format(new Date(LAST_REVIEWED_AT))}
            </time>
          </p>
        </Container>
      </header>

      <article className="py-10 sm:py-14">
        <Container size="narrow">
          <div className="prose-he">
            <h2>תקן הנגישות</h2>
            <p>
              האתר נבנה תוך התייחסות להנחיות WCAG 2.1 ברמת AA. אנחנו מתבססים
              עליהן כעוגן מקצועי, וכן על תקנות שוויון זכויות לאנשים עם
              מוגבלות (התאמות נגישות לשירות), התשע״ג–2013.
            </p>

            <h2>מה נעשה</h2>
            <ul>
              <li>תמיכה מלאה בעברית ובכיוון RTL</li>
              <li>ניווט מקלדת לכל הקישורים, הכפתורים והטפסים</li>
              <li>קישור דילוג לתוכן בראש הדף</li>
              <li>מצב פוקוס נראה לעין על אלמנטים אינטראקטיביים</li>
              <li>תיוג סמנטי של כותרות, ניווט ראשי ואזורי תוכן</li>
              <li>
                תוויות (<code>aria-label</code>) על כפתורים ושדות שאינם מתויגים
                חזותית
              </li>
              <li>
                הכרזה לקוראי מסך על תוצאה מכלי הבדיקה דרך{" "}
                <code>aria-live</code>
              </li>
              <li>
                כיבוד אוטומטי של העדפת &ldquo;צמצום תנועה&rdquo; של מערכת ההפעלה
              </li>
            </ul>

            <h2>מה עוד בעבודה</h2>
            <ul>
              <li>בדיקה ידנית מקיפה בקוראי מסך פופולריים (NVDA, VoiceOver)</li>
              <li>הרחבת מבדק הניגודיות לכל מצבי האתר (כולל מצב כהה)</li>
              <li>סקירת חוויה ידידותית למקלדת בכל מסלולי המשתמש המרכזיים</li>
            </ul>

            <h2>מצאתם תקלת נגישות?</h2>
            <p>
              אם נתקלתם בקושי לגשת לאיזור באתר, או שמשהו לא עובד עבורכם — נשמח
              שתספרו לנו. אנחנו מתייחסים לכל פנייה ברצינות וננסה לתקן בהקדם.
            </p>

            <h2>פנייה בנושא נגישות</h2>
            <p>
              כתבו אלינו במייל:{" "}
              <a href={site.contact.mailto}>{site.contact.email}</a>. בעת פנייה,
              אם אפשר, ציינו מהי הפעולה שניסיתם לבצע, באיזה דף הייתם, ובאיזה
              דפדפן או טכנולוגיה מסייעת השתמשתם. כל מידע נוסף יעזור לנו להגיע
              לפתרון מהר יותר.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              חזרה לעמוד הראשי
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              אודות האתר ‹
            </Link>
          </div>
        </Container>
      </article>
    </>
  );
}
