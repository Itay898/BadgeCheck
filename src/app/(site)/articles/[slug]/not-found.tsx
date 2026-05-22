import Link from "next/link";
import { Container } from "@/components/site/Container";

export default function NotFound() {
  return (
    <div className="py-24 sm:py-32">
      <Container size="narrow" className="text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
          שגיאה 404
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
          הכתבה לא נמצאה
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-[55ch] mx-auto leading-relaxed">
          ייתכן שהקישור שגוי, או שהכתבה הוסרה מהאתר. אפשר לחזור לארכיון
          הכתבות או לבדוק תו עכשיו.
        </p>
        <div className="mt-7 flex flex-wrap gap-3 justify-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-5 h-12 text-sm font-semibold hover:bg-brand-strong transition-colors shadow-[var(--elev-1)]"
          >
            לכל הכתבות
          </Link>
          <Link
            href="/#check"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 h-12 text-sm font-semibold hover:bg-foreground/5 transition-colors"
          >
            בדיקת תו
          </Link>
        </div>
      </Container>
    </div>
  );
}
