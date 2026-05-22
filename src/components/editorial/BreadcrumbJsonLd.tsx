import { site } from "@/content/site";

type Crumb = {
  /** Visible name in the breadcrumb */
  name: string;
  /** Path relative to the site root, starting with "/" */
  path: string;
};

/**
 * Emits a Schema.org BreadcrumbList JSON-LD block.
 * Pass crumbs from least specific (homepage) to most specific (current page).
 */
export function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.path}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
