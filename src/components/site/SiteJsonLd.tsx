import { site } from "@/content/site";

/**
 * Canonical @id values for the two site-level entities. Exported so page-level
 * JSON-LD (articles, collections) can point at the same nodes rather than
 * emitting duplicate Organization blocks.
 */
export const ORGANIZATION_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

/**
 * Site-level structured data: Organization + WebSite.
 * Rendered inside the site layout so it appears on every content page
 * (the /chat route — outside this layout — is intentionally excluded).
 */
export function SiteJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    // Stable @id so every other node on the site (WebSite.publisher,
    // Article.publisher/author) can reference this one entity instead of
    // repeating a look-alike Organization that search engines then have to
    // reconcile on their own.
    "@id": ORGANIZATION_ID,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/logo.png`,
      width: 512,
      height: 512,
    },
    description: site.description,
    inLanguage: "he",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    inLanguage: "he",
    publisher: { "@id": ORGANIZATION_ID },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
