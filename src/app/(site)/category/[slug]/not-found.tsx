import Link from "next/link";
import { Container } from "@/components/site/Container";
import { categories } from "@/content/categories";

export default function NotFound() {
  return (
    <div className="py-24 sm:py-32">
      <Container size="narrow" className="text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
          שגיאה 404
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
          הקטגוריה לא נמצאה
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-[55ch] mx-auto leading-relaxed">
          הקטגוריות הזמינות:
        </p>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="inline-flex items-center rounded-full border border-foreground/15 px-4 h-9 text-sm font-medium hover:bg-foreground/5 transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
