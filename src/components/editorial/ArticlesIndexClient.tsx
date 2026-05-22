"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { Container } from "@/components/site/Container";
import type { Article } from "@/content/articles";

type Props = { articles: Article[] };

function normalize(s: string): string {
  return s.trim().toLocaleLowerCase("he-IL");
}

function matches(article: Article, q: string): boolean {
  if (!q) return true;
  const haystack = `${article.title}\n${article.dek}`;
  return normalize(haystack).includes(q);
}

export function ArticlesIndexClient({ articles }: Props) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const liveId = useId();

  const q = normalize(query);
  const isSearching = q.length > 0;

  const filtered = useMemo(
    () => (isSearching ? articles.filter((a) => matches(a, q)) : articles),
    [articles, q, isSearching]
  );

  // When NOT searching, preserve the editorial layout: 2 featured + list.
  // When searching, render a flat list of matches for clarity.
  const [first, second, ...rest] = filtered;

  return (
    <>
      {/* Search bar */}
      <section className="py-6 sm:py-8 border-b border-border bg-paper-2/40">
        <Container>
          <label htmlFor={inputId} className="sr-only">
            חיפוש בכתבות
          </label>
          <div className="relative max-w-xl">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 end-3 grid place-items-center text-muted-foreground"
            >
              <Search size={18} />
            </span>
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש לפי כותרת או תקציר"
              autoComplete="off"
              aria-describedby={liveId}
              className="w-full h-12 rounded-full border border-input bg-background ps-4 pe-12 text-[15px] placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-brand/40 transition"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="ניקוי חיפוש"
                className="absolute inset-y-0 start-1.5 my-auto inline-grid place-items-center h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {/* Polite live region: announces result count for SR users */}
          <p
            id={liveId}
            aria-live="polite"
            className={
              isSearching
                ? "mt-3 text-sm text-muted-foreground"
                : "sr-only"
            }
          >
            {isSearching
              ? filtered.length === 0
                ? `לא נמצאו כתבות עבור “${query}”`
                : `נמצאו ${filtered.length} כתבות עבור “${query}”`
              : ""}
          </p>
        </Container>
      </section>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyResults query={query} />
      ) : isSearching ? (
        <section className="py-10 sm:py-14">
          <Container>
            <h2 className="sr-only">תוצאות חיפוש</h2>
            <div className="grid divide-y divide-border">
              {filtered.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="list" />
              ))}
            </div>
          </Container>
        </section>
      ) : (
        <>
          {(first || second) && (
            <section className="py-10 sm:py-14 border-b border-border">
              <Container>
                <div className="grid lg:grid-cols-2 gap-x-10 gap-y-12">
                  {first && <ArticleCard article={first} variant="default" />}
                  {second && <ArticleCard article={second} variant="default" />}
                </div>
              </Container>
            </section>
          )}

          {rest.length > 0 && (
            <section className="py-10 sm:py-14">
              <Container>
                <h2 className="sr-only">כתבות נוספות</h2>
                <div className="grid divide-y divide-border">
                  {rest.map((a) => (
                    <ArticleCard key={a.slug} article={a} variant="list" />
                  ))}
                </div>
              </Container>
            </section>
          )}
        </>
      )}
    </>
  );
}

function EmptyResults({ query }: { query: string }) {
  return (
    <div className="py-20 sm:py-24">
      <Container size="narrow" className="text-center">
        <p className="text-xl sm:text-2xl font-bold tracking-tight">
          לא נמצאו כתבות עבור &ldquo;{query}&rdquo;
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          נסו מילת חיפוש קצרה או כללית יותר. אפשר גם לעבור על כל הכתבות, או לחפש
          תשובה מהירה בשאלות הנפוצות.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            href="/articles"
            className="inline-flex items-center h-11 px-5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            כל הכתבות
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
