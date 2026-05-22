import { cn } from "@/lib/utils";

type Props = {
  author: string;
  publishedAt: string;
  readMinutes: number;
  className?: string;
};

const formatter = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function ArticleMeta({ author, publishedAt, readMinutes, className }: Props) {
  const date = formatter.format(new Date(publishedAt));
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
      <span aria-hidden className="opacity-40">·</span>
      <span>{readMinutes} דק׳ קריאה</span>
    </div>
  );
}
