import type { Metadata } from "next";

/**
 * Metadata for the /interactables route.
 *
 * This route is a leftover Tambo template demo, not part of the product. It is
 * unlinked and absent from the sitemap, but would still be indexable if
 * discovered. `noindex, nofollow` keeps this off-brand demo page out of search
 * results; `canonical` overrides the root layout's inherited `canonical: "/"`.
 */
export const metadata: Metadata = {
  title: "Interactables",
  alternates: { canonical: "/interactables" },
  robots: { index: false, follow: false },
};

export default function InteractablesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
