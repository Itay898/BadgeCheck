import Link from "next/link";
import { site } from "@/content/site";
import { categories } from "@/content/categories";
import { Container } from "./Container";
import { SiteLogo } from "./SiteLogo";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-background">
      <Container className="py-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SiteLogo />
            <p className="mt-4 text-muted-foreground text-[15px] leading-relaxed max-w-md">
              {site.description}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              אתר עצמאי. אינו אתר רשמי של משרד התחבורה. הנתונים מבוססים על מאגר
              המידע הציבורי ב־
              <a
                href="https://data.gov.il/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                data.gov.il
              </a>
              .
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-foreground mb-3">קטגוריות</h2>
            <ul className="space-y-2 text-[15px] text-muted-foreground">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-sm font-semibold text-foreground mb-3">כלים</h2>
            <ul className="space-y-2 text-[15px] text-muted-foreground">
              <li>
                <Link href="/#check" className="hover:text-foreground transition-colors">
                  בדיקת תו
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-foreground transition-colors">
                  כל הכתבות
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  שאלות נפוצות
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-foreground transition-colors">
                  עוזר חכם
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-sm font-semibold text-foreground mb-3">מידע</h2>
            <ul className="space-y-2 text-[15px] text-muted-foreground">
              {site.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 sm:gap-6 sm:items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {site.name}. כל הזכויות שמורות.</p>
          <p>
            המידע באתר אינו מהווה ייעוץ משפטי, רפואי או מקצועי. בכל ספק — פנו
            למקור רשמי.
          </p>
        </div>
      </Container>
    </footer>
  );
}
