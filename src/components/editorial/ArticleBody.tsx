import Link from "next/link";
import type { Article, ArticleBlock, InlineLink } from "@/content/articles";
import { InlineCheckCallout } from "./InlineCheckCallout";

/**
 * Render paragraph text, turning any declared substrings into internal links.
 * Inline links inherit the `.prose-he a` styling from globals.css.
 */
function renderInline(text: string, links?: InlineLink[]): React.ReactNode {
  if (!links || links.length === 0) return text;
  const pattern = links
    .map((l) => l.match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const parts = text.split(new RegExp(`(${pattern})`, "g"));
  return parts.map((part, i) => {
    const link = links.find((l) => l.match === part);
    return link ? (
      <Link key={i} href={link.href}>
        {part}
      </Link>
    ) : (
      part
    );
  });
}

/** Insert the inline check CTA after roughly half of the body. Skip very short articles. */
function injectIndex(total: number): number {
  if (total < 5) return -1;
  return Math.floor(total / 2);
}

function renderBlock(block: ArticleBlock, i: number): React.ReactNode {
  switch (block.type) {
    case "p":
      return <p key={i}>{renderInline(block.text, block.links)}</p>;
    case "h2":
      return <h2 key={i}>{block.text}</h2>;
    case "h3":
      return <h3 key={i}>{block.text}</h3>;
    case "ul":
      return (
        <ul key={i}>
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote key={i}>
          {block.text}
          {block.cite && (
            <footer className="mt-3 text-sm text-muted-foreground not-italic font-sans">
              — {block.cite}
            </footer>
          )}
        </blockquote>
      );
    case "callout":
      return (
        <aside
          key={i}
          className="not-prose my-6 rounded-xl border border-border bg-paper-2 p-4 sm:p-5 text-[14.5px] leading-relaxed text-foreground/85"
        >
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-strong mb-1">
            לתשומת לב
          </span>
          {block.text}
        </aside>
      );
  }
}

export function ArticleBody({ blocks }: { blocks: Article["body"] }) {
  const ctaAfter = injectIndex(blocks.length);
  const children: React.ReactNode[] = [];
  blocks.forEach((block, i) => {
    children.push(renderBlock(block, i));
    if (i === ctaAfter) {
      children.push(<InlineCheckCallout key={`cta-${i}`} />);
    }
  });
  return <div className="prose-he">{children}</div>;
}
