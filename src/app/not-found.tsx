import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-[calc(100vh-64px)] py-24 sm:py-32">
        <Container size="narrow" className="text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
            שגיאה 404
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
            הדף לא נמצא
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-[55ch] mx-auto leading-relaxed">
            הקישור שגוי או שהדף הוסר. אפשר לחזור לראשי, לקרוא כתבות, או לבדוק תו.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-5 h-12 text-sm font-semibold hover:bg-brand-strong transition-colors shadow-[var(--elev-1)]"
            >
              לעמוד הראשי
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 h-12 text-sm font-semibold hover:bg-foreground/5 transition-colors"
            >
              כל הכתבות
            </Link>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
