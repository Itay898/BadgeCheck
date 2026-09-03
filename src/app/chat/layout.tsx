import type { Metadata } from "next";

/**
 * Metadata for the /chat route.
 *
 * The chat page itself is a client component and cannot export metadata, so
 * this server-component layout supplies it:
 *  - `robots: noindex` — the assistant is a client-rendered tool with no
 *    crawlable content; keeping it out of the index avoids a thin-content page.
 *  - `canonical: "/chat"` — overrides the root layout's `canonical: "/"`, which
 *    would otherwise make /chat look like a duplicate of the homepage.
 */
export const metadata: Metadata = {
  title: "העוזר החכם",
  // Without this the route inherits the root layout's description, which
  // describes the plate checker — wrong copy for any link preview of /chat.
  description:
    "עוזר חכם שעונה בשפה חופשית על שאלות סביב תו נכה — זכאות, מסמכים ונהלים — ומפנה לכתבות ולכלי הבדיקה של תו צ׳ק.",
  alternates: { canonical: "/chat" },
  robots: { index: false, follow: true },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
