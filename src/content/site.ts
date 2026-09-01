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

export const site = {
  name: "תו צ׳ק",
  shortName: "TavCheck",
  tagline: "בדיקה פתוחה של תו נכה",
  description:
    "בודקים תוקף תו נכה לפי מספר רכב מול מאגר המידע הציבורי של ממשלת ישראל. לצד הכלי — מבט מסודר על התהליך, הזכויות והכללים.",
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
