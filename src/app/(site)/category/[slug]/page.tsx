import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/Container";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { CategoryFilter } from "@/components/editorial/CategoryFilter";
import { BreadcrumbJsonLd } from "@/components/editorial/BreadcrumbJsonLd";
import { categories, getCategory } from "@/content/categories";
import { listArticles } from "@/content/articles";
import { site } from "@/content/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return { title: "קטגוריה לא נמצאה" };
  return {
    title: cat.seoTitle,
    description: cat.description,
    alternates: { canonical: `/category/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const list = listArticles({ category: cat.slug });
  const [hero, ...rest] = list;

  // CollectionPage — marks the category page as a curated list of its articles.
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.name,
    description: cat.description,
    url: `${site.url}/category/${cat.slug}`,
    inLanguage: "he",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: list.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.url}/articles/${a.slug}`,
        name: a.title,
      })),
    },
  };

  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "ראשי", path: "/" },
          { name: cat.name, path: `/category/${cat.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <header className="pt-10 sm:pt-14 pb-8 border-b border-border">
        <Container>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
            קטגוריה
          </p>
          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            <h1 className="text-[32px] sm:text-[42px] font-bold leading-tight tracking-tight">
              {cat.name}
            </h1>
            <span
              aria-label={`${list.length} כתבות בקטגוריה`}
              className="inline-flex items-center h-7 rounded-full bg-foreground/[0.06] px-3 text-sm font-semibold text-foreground/70 tabular-nums"
            >
              {list.length} כתבות
            </span>
          </div>
          <p className="mt-3 text-[16px] text-muted-foreground max-w-[60ch] leading-relaxed">
            {cat.intro}
          </p>
          <div className="mt-7">
            <CategoryFilter activeSlug={cat.slug} />
          </div>
        </Container>
      </header>

      {hero ? (
        <>
          <section className="py-10 sm:py-14 border-b border-border">
            <Container>
              <ArticleCard article={hero} variant="featured" />
            </Container>
          </section>

          {rest.length > 0 && (
            <section className="py-10 sm:py-14">
              <Container>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                  {rest.map((a) => (
                    <ArticleCard key={a.slug} article={a} variant="default" />
                  ))}
                </div>
              </Container>
            </section>
          )}
        </>
      ) : (
        <EmptyCategory />
      )}
    </>
  );
}

function EmptyCategory() {
  return (
    <div className="py-24">
      <Container size="narrow" className="text-center">
        <p className="text-xl sm:text-2xl font-bold tracking-tight">
          הקטגוריה הזו עדיין מתמלאת
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          טרם פורסמו כאן כתבות. אפשר לעבור על שאר הכתבות באתר, או לבדוק תוקף תו
          נכה עכשיו.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            href="/articles"
            className="inline-flex items-center h-11 px-5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            כל הכתבות
          </Link>
          <Link
            href="/#check"
            className="inline-flex items-center h-11 px-5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors"
          >
            לבדיקת תו
          </Link>
        </div>
      </Container>
    </div>
  );
}
