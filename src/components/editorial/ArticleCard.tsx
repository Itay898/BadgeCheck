"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/content/articles";
import { Cover } from "./Cover";
import { CategoryChip } from "./CategoryChip";
import { ArticleMeta } from "./ArticleMeta";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: Article;
  variant?: "compact" | "default" | "featured" | "list";
  className?: string;
};

export function ArticleCard({ article, variant = "default", className }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
        className={cn("group", className)}
      >
        <Link
          href={`/articles/${article.slug}`}
          className="grid gap-7 md:grid-cols-2 md:gap-10 items-center"
        >
          <div className="overflow-hidden rounded-xl">
            <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02]">
              <Cover variant={article.cover} image={article.coverImage} aspect="wide" />
            </div>
          </div>
          <div>
            <CategoryChip slug={article.category} asLink={false} />
            <h2 className="mt-3 text-[26px] sm:text-[30px] md:text-[34px] leading-[1.15] font-bold tracking-tight group-hover:text-brand-strong transition-colors">
              {article.title}
            </h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted-foreground max-w-[55ch]">
              {article.dek}
            </p>
            <div className="mt-4">
              <ArticleMeta
                author={article.author}
                publishedAt={article.publishedAt}
                readMinutes={article.readMinutes}
              />
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === "list") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        className={cn("group", className)}
      >
        <Link
          href={`/articles/${article.slug}`}
          className="grid grid-cols-[96px_1fr] sm:grid-cols-[180px_1fr] gap-4 sm:gap-6 py-5 border-b border-border last:border-b-0"
        >
          <div className="overflow-hidden rounded-lg">
            <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
              <Cover variant={article.cover} image={article.coverImage} aspect="square" />
            </div>
          </div>
          <div className="min-w-0">
            <CategoryChip slug={article.category} asLink={false} />
            <h3 className="mt-2 text-base sm:text-lg leading-snug font-bold tracking-tight group-hover:text-brand-strong transition-colors">
              {article.title}
            </h3>
            <p className="mt-1.5 text-[13.5px] sm:text-[14.5px] text-muted-foreground line-clamp-2 leading-relaxed">
              {article.dek}
            </p>
            <div className="mt-2">
              <ArticleMeta
                author={article.author}
                publishedAt={article.publishedAt}
                readMinutes={article.readMinutes}
                className="text-xs"
              />
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        className={cn("group", className)}
      >
        <Link href={`/articles/${article.slug}`} className="block">
          <div className="overflow-hidden rounded-lg mb-3">
            <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
              <Cover variant={article.cover} image={article.coverImage} aspect="video" />
            </div>
          </div>
          <CategoryChip slug={article.category} asLink={false} />
          <h3 className="mt-2 text-base leading-snug font-bold tracking-tight group-hover:text-brand-strong transition-colors">
            {article.title}
          </h3>
          <ArticleMeta
            author={article.author}
            publishedAt={article.publishedAt}
            readMinutes={article.readMinutes}
            className="mt-2 text-[11.5px]"
          />
        </Link>
      </motion.article>
    );
  }

  // default — modern card with quiet border, hover shadow lift
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      className={cn("group", className)}
    >
      <Link
        href={`/articles/${article.slug}`}
        className="block h-full rounded-2xl border border-border bg-card p-3 transition-shadow duration-300 hover:shadow-[var(--elev-2)]"
      >
        <div className="overflow-hidden rounded-xl mb-4">
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02]">
            <Cover variant={article.cover} image={article.coverImage} aspect="video" />
          </div>
        </div>
        <div className="px-1.5 pb-2">
          <CategoryChip slug={article.category} asLink={false} />
          <h3 className="mt-2.5 text-[18px] leading-[1.25] font-bold tracking-tight group-hover:text-brand-strong transition-colors">
            {article.title}
          </h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground line-clamp-2">
            {article.dek}
          </p>
          <ArticleMeta
            author={article.author}
            publishedAt={article.publishedAt}
            readMinutes={article.readMinutes}
            className="mt-3 text-[11.5px]"
          />
        </div>
      </Link>
    </motion.article>
  );
}
