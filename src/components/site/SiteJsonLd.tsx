import { site, sources } from "@/content/site";
import { JsonLd } from "@/components/site/JsonLd";

/**
 * Canonical @id values for the two site-level entities. Exported so page-level
 * JSON-LD (articles, collections) can point at the same nodes rather than
 * emitting duplicate Organization blocks.
 */
export const ORGANIZATION_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;
/**
 * The public dataset every check runs against.
 *
 * Unlike Organization and WebSite — which `<SiteJsonLd />` puts on every page,
 * so an `@id` reference to them always resolves — the Dataset belongs only on
 * the two pages that are actually about it: the home page (which queries it)
 * and the dataset explainer (which describes it). Both render
 * `<DatasetJsonLd />`, so the node is present wherever something references
 * this @id and the reference never dangles.
 */
export const DATASET_ID = `${site.url}/#dataset`;

/**
 * The dataset behind the checker, described once and rendered by the two pages
 * that reference it. `distribution` names the CKAN endpoint `/api/check`
 * actually calls, so the graph matches what the code does.
 */
export function DatasetJsonLd() {
  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": DATASET_ID,
    name: "כלי רכב עם תג חניה לנכה",
    alternateName: "מאגר תווי הנכה של משרד התחבורה",
    description:
      "מאגר המידע הציבורי של משרד התחבורה ובו מספרי הרכב המשויכים לתג חניה לנכה, תאריך הפקת התג וסוג התג. המאגר אינו כולל שמות, מספרי זהות או תאריך תפוגה.",
    url: sources.datasetResource,
    sameAs: sources.dataset,
    inLanguage: "he",
    isAccessibleForFree: true,
    creator: {
      "@type": "GovernmentOrganization",
      name: "משרד התחבורה והבטיחות בדרכים",
      url: sources.ministryLookup,
    },
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: sources.datasetApi,
    },
  };

  return <JsonLd data={dataset} />;
}

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
    // Where our facts come from. These are the entities a reader would check
    // us against, so naming them here grounds the publisher rather than
    // leaving it as an unattached name.
    knowsAbout: ["תו נכה", "תג חניה לנכה", "חניה לנכים בישראל"],
    // Only emitted once a real mailbox is configured — see `contact.isConfigured`.
    ...(site.contact.isConfigured
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: site.contact.email,
            availableLanguage: ["he"],
          },
        }
      : {}),
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
      <JsonLd data={organization} />
      <JsonLd data={website} />
    </>
  );
}
