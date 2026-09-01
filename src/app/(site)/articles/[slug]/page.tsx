import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Cover } from "@/components/editorial/Cover";
import { CategoryChip } from "@/components/editorial/CategoryChip";
import { ArticleMeta } from "@/components/editorial/ArticleMeta";
import { ArticleBody } from "@/components/editorial/ArticleBody";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { ReadingProgress } from "@/components/editorial/ReadingProgress";
import { SectionHeader } from "@/components/editorial/SectionHeader";
import { BreadcrumbJsonLd } from "@/components/editorial/BreadcrumbJsonLd";
import { articles, getArticle, listArticles } from "@/content/articles";
import { getCategory } from "@/content/categories";
import { site } from "@/content/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "כתבה לא נמצאה" };
  const path = `/articles/${article.slug}`;
  // Share the article's cover image in link previews (OpenGraph + Twitter).
  // Relative paths resolve against `metadataBase` set in the root layout.
  const ogImages = article.coverImage
    ? [{ url: article.coverImage, alt: article.title }]
    : undefined;
  return {
    // SERP snippet uses the SEO variants; OpenGraph/Twitter below keep the
    // editorial headline, which reads better in social link previews.
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.dek,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      url: path,
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.dek,
      images: ogImages,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const related = listArticles({
    category: article.category,
    excludeSlug: article.slug,
    limit: 3,
  });

  // Only the `news` category is actual news; everything else is editorial.
  // Using NewsArticle for guides/rights is misleading per Google's schema guide.
  const articleType = article.category === "news" ? "NewsArticle" : "Article";
  const articleUrl = `${site.url}/articles/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": articleType,
    headline: article.title,
    description: article.dek,
    image: article.coverImage ? `${site.url}${article.coverImage}` : undefined,
    datePublished: article.publishedAt,
    // `updatedAt` marks a substantive content revision; an unmodified
    // article's dateModified legitimately equals its datePublished.
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: "he",
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    // Byline is the editorial board, so Organization (not Person).
    author: { "@type": "Organization", name: article.author, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    articleSection: category?.name,
  };

  // HowTo structured data for step-by-step guides that declare explicit steps.
  const howToJsonLd = article.howToSteps
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: article.title,
        description: article.dek,
        inLanguage: "he",
        step: article.howToSteps.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        })),
      }
    : null;

  return (
    <article>
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}
      <BreadcrumbJsonLd
        crumbs={[
          { name: "ראשי", path: "/" },
          ...(category
            ? [{ name: category.name, path: `/category/${category.slug}` }]
            : []),
          { name: article.title, path: `/articles/${article.slug}` },
        ]}
      />

      {/* HEAD */}
      <header className="pt-10 sm:pt-14 pb-8 border-b border-border">
        <Container size="narrow">
          <nav aria-label="פירורי לחם" className="text-xs text-muted-foreground mb-6">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  ראשי
                </Link>
              </li>
              <li aria-hidden>‹</li>
              {category && (
                <>
                  <li>
                    <Link
                      href={`/category/${category.slug}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                  <li aria-hidden>‹</li>
                </>
              )}
              <li className="text-foreground/70 truncate max-w-[60vw]">{article.title}</li>
            </ol>
          </nav>

          <CategoryChip slug={article.category} />
          <h1 className="mt-4 text-[30px] sm:text-[40px] lg:text-[46px] leading-[1.1] font-bold tracking-tight">
            {article.title}
          </h1>
          <p className="mt-4 text-[17px] sm:text-lg text-muted-foreground leading-relaxed max-w-[60ch]">
            {article.dek}
          </p>
          <div className="mt-6">
            <ArticleMeta
              author={article.author}
              publishedAt={article.publishedAt}
              updatedAt={article.updatedAt}
              readMinutes={article.readMinutes}
            />
          </div>
        </Container>
      </header>

      {/* LEAD VISUAL */}
      <div className="bg-paper-2/40 py-10">
        <Container size="narrow">
          <Cover
            variant={article.cover}
            image={article.coverImage}
            aspect="wide"
            priority
            label={article.title}
          />
        </Container>
      </div>

      {/* BODY */}
      <div className="py-10 sm:py-14">
        <Container size="narrow">
          <ArticleBody blocks={article.body} />

          <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              לכל הכתבות
            </Link>
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                עוד בקטגוריית {category.name} ‹
              </Link>
            )}
          </div>
        </Container>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="border-t border-border py-[var(--section-pad-y)] bg-paper-2/40">
          <Container>
            <SectionHeader
              eyebrow="ממשיכים לקרוא"
              title="עוד באותו נושא"
              link={
                category
                  ? { href: `/category/${category.slug}`, label: `כל ${category.name}` }
                  : undefined
              }
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="default" />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
