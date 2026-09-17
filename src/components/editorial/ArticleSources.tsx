import { ExternalLink } from "lucide-react";
import type { Article } from "@/content/articles";

/**
 * The "מקורות" block at the foot of an article.
 *
 * /about promises in prose that everything here is checkable against a named
 * authority; this is where that promise becomes clickable. It renders nothing
 * for an article that declares no sources rather than showing an empty shell —
 * an article with no citations should look like one.
 *
 * Links open in a new tab and carry `rel="noopener"`, but deliberately not
 * `nofollow`: these are editorial endorsements of the official source, which
 * is the whole point of the block.
 */
export function ArticleSources({ citations }: { citations: Article["citations"] }) {
  if (!citations || citations.length === 0) return null;

  return (
    <aside
      aria-labelledby="article-sources"
      className="mt-12 rounded-2xl border border-border bg-paper-2 p-5 sm:p-6"
    >
      <h2
        id="article-sources"
        className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-strong"
      >
        מקורות
      </h2>
      <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">
        הכתבה נשענת על המקורות הרשמיים הבאים. כשנוהל או תנאי משתנים, המקור הוא
        הקובע - לא אנחנו.
      </p>
      <ul className="mt-4 space-y-2.5">
        {citations.map((c) => (
          <li key={c.url}>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-start gap-2 text-[14.5px] font-medium text-foreground/85 hover:text-brand-strong transition-colors"
            >
              <ExternalLink
                size={14}
                aria-hidden
                className="mt-1 shrink-0 text-brand"
              />
              <span className="underline underline-offset-4 decoration-border group-hover:decoration-current">
                {c.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
