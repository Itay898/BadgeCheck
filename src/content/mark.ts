/**
 * The logomark, in one place.
 *
 * The shape is the physical תו נכה: a card that hangs from the mirror, with a
 * punched hole near the top, carrying a check — the permit, verified. It is
 * drawn on a 512 grid and scaled by the consumer's viewBox, so it stays crisp
 * from a 16px favicon up to the 512px app icon.
 *
 * Three surfaces render it and they must not drift apart:
 *   - `src/app/icon.svg` and the generated raster icons (a static copy of the
 *     SVG below — regenerate them when this changes)
 *   - `SiteLogo` in the page header, which builds the same paths as JSX
 *   - the OG card, which embeds `MARK_SVG` as a data URI
 */

/**
 * Brand teal, deliberately hard-coded rather than read from `--brand`.
 * The token flips to a much lighter teal in dark mode, which would leave the
 * white card sitting on a near-white tile — and would also mean the header
 * mark no longer matched the favicon, which cannot follow the page theme.
 */
export const MARK_BRAND = "#0A6F8C";

/** Tile corner radius on the 512 grid (22.6%). */
export const MARK_RADIUS = 116;

/** The card and its punched hole, as one even-odd path. */
export const MARK_CARD =
  "M167 100h178a36 36 0 0 1 36 36v240a36 36 0 0 1-36 36H167a36 36 0 0 1-36-36V136a36 36 0 0 1 36-36zm89 42a30 30 0 1 0 0 60 30 30 0 0 0 0-60z";

/** The check, stroked rather than filled so it keeps even weight. */
export const MARK_CHECK = "M180 292 L234 346 L336 240";
export const MARK_CHECK_WIDTH = 46;

/** Standalone SVG, for the surfaces that cannot take JSX. */
export const MARK_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
  `<rect width="512" height="512" rx="${MARK_RADIUS}" fill="${MARK_BRAND}"/>` +
  `<path fill="#FFFFFF" fill-rule="evenodd" d="${MARK_CARD}"/>` +
  `<path d="${MARK_CHECK}" fill="none" stroke="${MARK_BRAND}" stroke-width="${MARK_CHECK_WIDTH}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `</svg>`;
