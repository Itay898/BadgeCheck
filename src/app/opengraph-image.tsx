import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { MARK_SVG } from "@/content/mark";

export const runtime = "nodejs";
export const alt = `${site.name} — בדיקת תו נכה לפי מספר רכב`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Satori takes the logomark as an image rather than inline SVG, which it
 * supports only partially. Base64 sidesteps URL-encoding pitfalls with the
 * `#` in the fill colours.
 */
const MARK_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(MARK_SVG).toString("base64")}`;

/**
 * Editorial OG card — warm paper, deep ink, single teal accent.
 * Pulls Heebo at request time so Hebrew renders correctly. If the fetch fails
 * (offline build, blocked egress), we fall back to a typography-only image
 * so the route never crashes.
 */
async function loadHeebo700(): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Heebo:wght@700&display=swap",
      {
        // Force a font format Satori accepts (ttf/otf/woff).
        headers: { "User-Agent": "Mozilla/4.0 (compatible)" },
      }
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const urlMatch = css.match(/src:\s*url\(([^)]+)\)\s*format/);
    const fontUrl = urlMatch?.[1];
    if (!fontUrl) return null;
    const fontRes = await fetch(fontUrl);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

// Matches the new product-led palette in globals.css (cool neutrals +
// blue-leaning teal brand).
const COLORS = {
  paper: "#FBFCFD",
  paper2: "#F0F3F6",
  ink: "#161922",
  inkSoft: "#5A6273",
  rule: "#DBE0E8",
  brand: "#0A6F8C",
  brandStrong: "#0B5A73",
  brandSoft: "#DCEEF5",
};

export default async function Image() {
  const heebo = await loadHeebo700();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          background: COLORS.paper,
          color: COLORS.ink,
          fontFamily: "Heebo, sans-serif",
          direction: "rtl",
        }}
      >
        {/* Top row: brand chip + accent stripe on the right (RTL start) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* Same artwork as the favicon and the header tile. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- this
                tree is rendered to a PNG by Satori, not by a browser;
                next/image does not exist in that runtime. */}
            <img src={MARK_DATA_URI} width={56} height={56} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>
                {site.name}
              </div>
              <div style={{ fontSize: 18, color: COLORS.inkSoft, marginTop: 2 }}>
                כלי בדיקה עצמאי
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              background: COLORS.brandSoft,
              color: COLORS.brand,
              borderRadius: 999,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            <span
              style={{
                display: "flex",
                width: 10,
                height: 10,
                background: COLORS.brand,
                borderRadius: 999,
              }}
            />
            מבוסס על data.gov.il
          </div>
        </div>

        {/* Center: headline (two stacked lines) + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1020 }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: COLORS.ink,
            }}
          >
            בדיקת תו נכה
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: COLORS.brand,
            }}
          >
            לפי מספר רכב
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: COLORS.inkSoft,
              lineHeight: 1.4,
              marginTop: 8,
            }}
          >
            חינם, ללא הרשמה, מול מאגר המידע הציבורי של ממשלת ישראל.
          </div>
        </div>

        {/* Bottom row: thin rule + wordmark on the RTL end (left) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 1,
              background: COLORS.rule,
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 22, color: COLORS.inkSoft }}>
              מדריכים · זכויות · חדשות
            </div>
            <div
              style={{
                display: "flex",
                direction: "ltr",
                fontSize: 20,
                letterSpacing: "0.22em",
                color: COLORS.inkSoft,
                textTransform: "uppercase",
              }}
            >
              TAVCHECK
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: heebo
        ? [
            {
              name: "Heebo",
              data: heebo,
              weight: 700,
              style: "normal",
            },
          ]
        : undefined,
    }
  );
}
