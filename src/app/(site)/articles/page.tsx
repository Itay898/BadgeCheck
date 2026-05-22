import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/Container";
import { ArticlesIndexClient } from "@/components/editorial/ArticlesIndexClient";
import { CategoryFilter } from "@/components/editorial/CategoryFilter";
import { listArticles } from "@/content/articles";

export const metadata: Metadata = {
  title: "כל הכתבות על תו נכה — מדריכים, זכויות וחדשות",
  description:
    "כל הכתבות, המדריכים, החדשות והזכויות סביב תו הנכה הישראלי — במקום אחד.",
  alternates: { canonical: "/articles" },
};

export default function ArticlesIndexPage() {
  const list = listArticles();

  return (
    <>
      <header className="pt-10 sm:pt-14 pb-8 border-b border-border">
        <Container>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
            ארכיון
          </p>
          <h1 className="mt-4 text-[32px] sm:text-[42px] font-bold leading-tight tracking-tight">
            כל הכתבות
          </h1>
          <p className="mt-3 text-[16px] text-muted-foreground max-w-[58ch] leading-relaxed">
            מדריכים, חדשות וזכויות סביב תו הנכה. מתעדכן באופן שוטף.
          </p>
          <div className="mt-7">
            <CategoryFilter />
          </div>
        </Container>
      </header>

      {list.length === 0 ? (
        <EmptyArchive />
      ) : (
        <ArticlesIndexClient articles={list} />
      )}
    </>
  );
}

function EmptyArchive() {
  return (
    <div className="py-24 text-center">
      <Container size="narrow">
        <p className="text-xl sm:text-2xl font-bold tracking-tight">
          הארכיון בהכנה
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          הכתבות הראשונות בדרך. בינתיים אפשר כבר לבדוק תוקף תו נכה, או לעבור על
          השאלות הנפוצות.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            href="/#check"
            className="inline-flex items-center h-11 px-5 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-strong transition-colors shadow-[var(--elev-1)]"
          >
            לבדיקת תו
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center h-11 px-5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors"
          >
            שאלות נפוצות
          </Link>
        </div>
      </Container>
    </div>
  );
}
