import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, link, className }: Props) {
  return (
    <div className={cn("mb-7 sm:mb-8 flex items-end justify-between gap-6", className)}>
      <div>
        {eyebrow && (
          <p className="inline-flex items-center rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5 mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="text-[22px] sm:text-[26px] leading-tight font-bold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-[15px] text-muted-foreground max-w-[60ch] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-strong transition-colors whitespace-nowrap pb-1 group"
        >
          {link.label}
          <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
            ‹
          </span>
        </Link>
      )}
    </div>
  );
}
