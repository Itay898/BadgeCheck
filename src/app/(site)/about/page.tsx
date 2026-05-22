import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/Container";
import { ArrowLeft } from "lucide-react";
import { site } from "@/content/site";
import { BreadcrumbJsonLd } from "@/components/editorial/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "אודות",
  description:
    "מי אנחנו, על מה האתר מבוסס, ומה הוא לא. תו צ׳ק הוא כלי בדיקה פתוח ולא תחליף לייעוץ רשמי.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "ראשי", path: "/" },
          { name: "אודות", path: "/about" },
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
              <li className="text-foreground/70">אודות</li>
            </ol>
          </nav>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
            אודות
          </p>
          <h1 className="mt-4 text-[32px] sm:text-[42px] font-bold leading-tight tracking-tight">
            על {site.name}
          </h1>
          <p className="mt-3 text-[16px] text-muted-foreground leading-relaxed">
            כלי פתוח לבדיקת תו נכה לפי מספר רכב, לצד מבט מסודר על התהליך והכללים.
          </p>
        </Container>
      </header>

      <article className="py-10 sm:py-14">
        <Container size="narrow">
          <div className="prose-he">
            <h2>מה האתר הזה</h2>
            <p>
              {site.name} הוא אתר עצמאי שעוזר לבדוק האם רכב מסוים רשום עם תו נכה
              תקף, על בסיס מאגר המידע הציבורי של ממשלת ישראל ב־data.gov.il. לצד
              הכלי אנחנו מפרסמים כתבות מסבירות סביב התהליך, הזכויות הנלוות
              והכללים שמלווים את התו.
            </p>

            <h2>מה האתר הזה לא</h2>
            <p>
              האתר אינו אתר רשמי של משרד התחבורה או של כל גוף ממשלתי אחר.
              המידע באתר אינו תחליף לייעוץ משפטי, רפואי או מקצועי. בכל שאלה
              שמשפיעה על זכאות, על אגרות, או על החלטה רשמית — מומלץ לפנות
              ישירות לגוף הרלוונטי.
            </p>

            <h2>איך הבדיקה עובדת</h2>
            <p>
              כאשר אתם מזינים מספר רכב, השרת שלנו מעביר את השאילתה לממשק
              הציבורי של ממשלת ישראל ב־data.gov.il, מחפש את הרשומה התואמת
              ומחזיר לכם את התוצאה. מעבר לכך, אנחנו לא שומרים את מספרי הרכבים
              אצלנו ולא משייכים אותם לזהותכם. אין צורך בהרשמה, אין שמירת
              היסטוריה אישית, ואין שיתוף של הנתונים עם גורם מסחרי כלשהו.
            </p>

            <h2>על דיוק המידע</h2>
            <p>
              המידע מגיע ממאגר ציבורי, והוא תקף ברגע השאילתה. ייתכן עיכוב בין
              עדכון רשמי במשרד התחבורה לבין הופעת השינוי במאגר הציבורי. במקרה
              של ספק — שאלת התוקף חוזרת תמיד למסמך התו הרשמי ולמערכות משרד
              התחבורה.
            </p>

            <h2>תיקונים</h2>
            <p>
              אם נתקלתם בטעות עובדתית, בנוסח שאינו מדויק או במידע שזקוק
              לעדכון — נשמח לדעת. נשתדל לבחון ולתקן בהקדם, ולציין בכתבה אם נעשה
              עדכון מהותי. ניתן לפנות אלינו במייל{" "}
              <a href={site.contact.mailto}>{site.contact.email}</a>.
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
              href="/accessibility"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              הצהרת נגישות ‹
            </Link>
          </div>
        </Container>
      </article>
    </>
  );
}
