import { cn } from "@/lib/utils";

type Props = {
  author: string;
  publishedAt: string;
  /** Last substantive revision — rendered visibly so it matches JSON-LD dateModified. */
  updatedAt?: string;
  readMinutes: number;
  className?: string;
};

const formatter = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function ArticleMeta({ author, publishedAt, updatedAt, readMinutes, className }: Props) {
  const date = formatter.format(new Date(publishedAt));
  const updated =
    updatedAt && updatedAt !== publishedAt
      ? formatter.format(new Date(updatedAt))
      : null;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-muted-foreground",
        className
      )}
    >
      <span className="text-foreground/90 font-medium">{author}</span>
      <span aria-hidden className="opacity-40">·</span>
      <time dateTime={publishedAt}>{date}</time>
      {updated && (
        <>
          <span aria-hidden className="opacity-40">·</span>
          <span>
            עודכן ב־<time dateTime={updatedAt}>{updated}</time>
          </span>
        </>
      )}
      <span aria-hidden className="opacity-40">·</span>
      <span>{readMinutes} דק׳ קריאה</span>
    </div>
  );
}
