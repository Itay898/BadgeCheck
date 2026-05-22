import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCategory, type Category } from "@/content/categories";

const toneStyles: Record<Category["tone"], string> = {
  brand: "text-brand-strong bg-brand-soft",
  amber: "text-[#8a5a00] bg-[#fff2d3]/80 dark:text-amber-200 dark:bg-amber-200/10",
  rose: "text-[#9c2a4d] bg-[#ffd9e3]/80 dark:text-rose-200 dark:bg-rose-200/10",
  slate: "text-foreground/80 bg-foreground/[0.06]",
};

type Props = {
  slug: string;
  size?: "sm" | "md";
  asLink?: boolean;
  className?: string;
};

export function CategoryChip({ slug, size = "sm", asLink = true, className }: Props) {
  const cat = getCategory(slug);
  if (!cat) return null;
  const cls = cn(
    "inline-flex items-center rounded-full font-semibold tracking-tight",
    toneStyles[cat.tone],
    size === "sm" ? "text-[11px] px-2.5 py-0.5" : "text-[12.5px] px-3 py-1",
    className
  );
  if (!asLink) return <span className={cls}>{cat.name}</span>;
  return (
    <Link
      href={`/category/${cat.slug}`}
      className={cn(cls, "hover:opacity-85 transition-opacity")}
    >
      {cat.name}
    </Link>
  );
}
