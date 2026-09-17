/**
 * Site identity + nav config.
 * `url` and `contact.email` resolve from env vars (NEXT_PUBLIC_SITE_URL,
 * NEXT_PUBLIC_CONTACT_EMAIL) with placeholder fallbacks. Using `.example` TLDs
 * is intentional — RFC 2606 reserves them so the fallback can never hit a real
 * mailbox, and copy that references the email gracefully reads as a placeholder
 * until the env var is set.
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl = (rawUrl && /^https?:\/\//.test(rawUrl) ? rawUrl : "http://localhost:3000").replace(/\/$/, "");

const rawEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
const hasRealContactEmail = Boolean(rawEmail && /.+@.+\..+/.test(rawEmail));
const contactEmail = hasRealContactEmail ? rawEmail! : "hello@tavcheck.example";

/**
 * GA4 measurement ID. It is public by nature (it ships in every page's HTML),
 * so the production value lives here rather than only in hosting env vars — a
 * deploy that forgets NEXT_PUBLIC_GA_ID still reports. The env var lets a
 * preview or staging build point at a different property without a code change.
 *
 * An override that is present but malformed disables analytics for that build
 * (with a build-log warning) instead of quietly falling back to the production
 * property — otherwise a typo on a staging host would merge its traffic into
 * production data with no signal.
 */
const GA_ID_PATTERN = /^G-[A-Z0-9]{6,12}$/;
const PRODUCTION_GA_ID = "G-YX84RQZ89Y";

function resolveGaMeasurementId(): string | undefined {
  const override = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!override) return PRODUCTION_GA_ID;
  if (GA_ID_PATTERN.test(override)) return override;
  console.warn(
    `[site] NEXT_PUBLIC_GA_ID="${override}" is not a GA4 measurement ID (expected G-XXXXXXXXXX); analytics disabled for this build.`,
  );
  return undefined;
}

/**
 * Google AdSense publisher ID (ca-pub-…). Unlike the GA ID there is no
 * committed default: ads stay off until NEXT_PUBLIC_ADSENSE_CLIENT is set, and
 * a malformed value is rejected with a build-log warning. The optional article
 * slot enables one manual in-article unit; Auto ads need only the publisher ID.
 */
const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d{10,20}$/;
const ADSENSE_SLOT_PATTERN = /^\d{6,16}$/;

function resolveAdsenseClient(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (!raw) return undefined;
  if (ADSENSE_CLIENT_PATTERN.test(raw)) return raw;
  console.warn(
    `[site] NEXT_PUBLIC_ADSENSE_CLIENT="${raw}" is not an AdSense publisher ID (expected ca-pub-XXXXXXXXXXXXXXXX); ads disabled for this build.`,
  );
  return undefined;
}

function resolveAdsenseSlot(name: string, raw: string | undefined): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  if (ADSENSE_SLOT_PATTERN.test(value)) return value;
  console.warn(`[site] ${name}="${value}" is not an AdSense ad-unit ID (digits only); that unit is disabled for this build.`);
  return undefined;
}

/**
 * The official sources this site is built on, in one place.
 *
 * Every factual claim on the site traces back to one of these, and until now
 * they appeared only as unlinked plain text ("באתר gov.il", "ב-data.gov.il").
 * Naming them as real URLs is what lets a reader — or a model summarising the
 * page — verify a claim instead of taking our word for it.
 *
 * Worth knowing: gov.il and data.gov.il both answer AI crawlers with a
 * Cloudflare 403, so an assistant answering a question about תו נכה usually
 * cannot read the primary source at all. Linking them does not fix that, but
 * it does make this page the accessible, attributed path to them.
 */
/** CKAN resource id of the "כלי רכב עם תג חניה לנכה" table on data.gov.il. */
const DATASET_RESOURCE_ID = "c8b9f9c8-4612-4068-934f-d4acd2e3c06e";

export const sources = {
  /** The CKAN dataset the checker queries: "כלי רכב עם תג חניה לנכה". */
  dataset: "https://data.gov.il/dataset/rechev-tag-nachim",
  /**
   * CKAN resource id for the badge table. The API route queries it and the
   * Dataset structured data advertises it, so it lives here rather than being
   * spelled out in both — they must describe the same table.
   */
  datasetResourceId: DATASET_RESOURCE_ID,
  /** The dataset's specific resource page (the table itself). */
  datasetResource: `https://data.gov.il/he/datasets/ministry_of_transport/rechev-tag-nachim/${DATASET_RESOURCE_ID}`,
  /** The CKAN datastore query endpoint, as advertised in `Dataset.distribution`. */
  datasetApi: `https://data.gov.il/api/3/action/datastore_search?resource_id=${DATASET_RESOURCE_ID}`,
  /** Ministry of Transport: apply for / renew / update a badge. */
  ministryService: "https://www.gov.il/he/service/disability_parking_badge",
  /** Ministry of Transport's own public lookup for badge-linked vehicles. */
  ministryLookup:
    "https://www.gov.il/he/departments/dynamiccollectors/disability_parking_badge_cars",
  /**
   * National Insurance: eligibility conditions, and the explicit statement
   * that it does NOT issue badges. Percent-encoded because the path is
   * Hebrew with literal spaces ("…/Pages/תג חניה לרכב נכה.aspx") — an
   * unencoded space would break the href.
   */
  nationalInsurance:
    "https://www.btl.gov.il/benefits/Disability/otherbenefits/Pages/%D7%AA%D7%92%20%D7%97%D7%A0%D7%99%D7%94%20%D7%9C%D7%A8%D7%9B%D7%91%20%D7%A0%D7%9B%D7%94.aspx",
  /** חוק חניה לנכים, התשנ״ד-1993, full text. */
  parkingLaw: "https://www.nevo.co.il/law_html/law01/310_113.htm",
  /**
   * אגף השיקום, משרד הביטחון — the separate badge track for IDF disabled
   * veterans. Listed because it is a genuinely different route with a
   * different authority, and sending someone down the wrong one wastes months.
   */
  defenceRehab: "https://shikum.mod.gov.il/transportation/parking-badge",
  /**
   * Israel Police announcement, 9 Dec 2024 — the יאח״ה / להב 433 investigation
   * into serial issuing of forged badges. The primary source for the forgery
   * story, which otherwise circulates only as secondary reporting.
   */
  policeForgeryCase: "https://www.gov.il/he/pages/police_09-12-24_tag",
} as const;

export const site = {
  name: "תו צ׳ק",
  shortName: "TavCheck",
  tagline: "בדיקה פתוחה של תו נכה",
  description:
    "בודקים תוקף תו נכה לפי מספר רכב מול מאגר המידע הציבורי של ממשלת ישראל. לצד הכלי - מבט מסודר על התהליך, הזכויות והכללים.",
  /**
   * Search-result copy (meta title/description). Kept separate from
   * `description`, which doubles as on-site footer/JSON-LD copy — SERP
   * snippets are written keyword-first with explicit value props for CTR.
   *
   * The title leads with "לרכב" deliberately: Google's Hebrew autocomplete
   * ranks "בדיקת תו נכה לרכב" above "בדיקת תו נכה לפי מספר רכב", and both
   * direct competitors (checktav.co.il, tagneche.co.il) title on the "לרכב"
   * form. "מאגר משרד התחבורה" stays because the rest of that SERP is
   * app-store listings — naming the official source is what separates us
   * from them, and the description says so in plain words.
   */
  seo: {
    title: "בדיקת תו נכה לרכב לפי מספר רכב - מאגר משרד התחבורה | תו צ׳ק",
    description:
      "הקלידו מספר רכב וקבלו תוך שנייה אם יש לרכב תו נכה (תג נכה) בתוקף - ישירות מהמאגר הרשמי של משרד התחבורה. חינם, בלי הרשמה ובלי להוריד אפליקציה.",
  },
  url: siteUrl,
  contact: {
    email: contactEmail,
    mailto: `mailto:${contactEmail}`,
    /**
     * False while the address is still the RFC 2606 `.example` placeholder.
     * Structured data checks this before emitting a `contactPoint`: publishing
     * an unreachable address as machine-readable fact is worse than publishing
     * no address at all, because aggregators and assistants will repeat it.
     */
    isConfigured: hasRealContactEmail,
  },
  analytics: {
    gaMeasurementId: resolveGaMeasurementId(),
  },
  ads: {
    adsenseClient: resolveAdsenseClient(),
    slots: {
      article: resolveAdsenseSlot("NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE", process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE),
    },
  },
  nav: [
    { href: "/dataset", label: "המאגר במספרים" },
    { href: "/articles", label: "כתבות" },
    { href: "/category/guides", label: "מדריכים" },
    { href: "/category/rights", label: "זכויות" },
    { href: "/category/news", label: "חדשות" },
    { href: "/faq", label: "שאלות נפוצות" },
  ],
  cta: { href: "/#check", label: "בדיקת תו" },
  legal: [
    { href: "/about", label: "אודות" },
    { href: "/accessibility", label: "נגישות" },
  ],
} as const;
