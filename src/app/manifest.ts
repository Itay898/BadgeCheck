import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Web app manifest. Next emits `<link rel="manifest">` automatically from this
 * file, which is also what gives Android a real home-screen icon instead of a
 * screenshot of the page.
 *
 * `theme_color` is the brand teal (the installed title bar), while
 * `background_color` is the page ground shown during launch — they are
 * deliberately different. Both hexes mirror the tokens in globals.css.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "he",
    dir: "rtl",
    theme_color: "#0A6F8C",
    background_color: "#FAFCFE",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android masks icons to its own shape; the maskable art keeps the glyph
      // inside the 80% safe circle so no part of it is cropped away.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
