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
const contactEmail = rawEmail && /.+@.+\..+/.test(rawEmail) ? rawEmail : "hello@tavcheck.example";

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
   */
  seo: {
    title: "בדיקת תו נכה לפי מספר רכב – מאגר משרד התחבורה | תו צ׳ק",
    description:
      "הקלידו מספר רכב וקבלו תוך שנייה אם יש לרכב תו נכה (תג נכה) בתוקף – ישירות מהמאגר הרשמי של משרד התחבורה. חינם, בלי הרשמה ובלי שמירת פרטים.",
  },
  url: siteUrl,
  contact: {
    email: contactEmail,
    mailto: `mailto:${contactEmail}`,
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
