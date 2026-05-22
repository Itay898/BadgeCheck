import Link from "next/link";
import { cn } from "@/lib/utils";
import { categories } from "@/content/categories";
import { listArticles } from "@/content/articles";

type Props = {
  activeSlug?: string;
  className?: string;
};

export function CategoryFilter({ activeSlug, className }: Props) {
  const totalCount = listArticles().length;

  return (
    <nav
      aria-label="סינון לפי קטגוריה"
      className={cn("overflow-x-auto -mx-5 px-5", className)}
    >
      <ul className="flex gap-2 min-w-max">
        <li>
          <FilterPill href="/articles" active={!activeSlug} count={totalCount}>
            הכל
          </FilterPill>
        </li>
        {categories.map((c) => {
          const count = listArticles({ category: c.slug }).length;
          return (
            <li key={c.slug}>
              <FilterPill
                href={`/category/${c.slug}`}
                active={activeSlug === c.slug}
                count={count}
              >
                {c.name}
              </FilterPill>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function FilterPill({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border h-9 ps-4 pe-3 text-sm font-medium transition-colors",
        active
          ? "bg-foreground text-background border-foreground"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      )}
    >
      <span>{children}</span>
      {typeof count === "number" && (
        <span
          aria-label={`${count} כתבות`}
          className={cn(
            "inline-flex items-center justify-center min-w-[1.5rem] h-5 rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
            active
              ? "bg-background/15 text-background"
              : "bg-foreground/8 text-foreground/70"
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
