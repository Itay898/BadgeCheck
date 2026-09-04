import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl",
  subsets: ["hebrew", "latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.title,
    template: `%s · ${site.name}`,
  },
  description: site.seo.description,
  alternates: {
    canonical: "/",
    languages: { "he-IL": "/" },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: site.name,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
};

export const viewport: Viewport = {
  // Mirrors --paper in globals.css for each scheme. The previous pair was a
  // warm cream left over from an earlier palette, so the mobile browser chrome
  // rendered warm against a cool page.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFCFE" },
    { media: "(prefers-color-scheme: dark)", color: "#090D14" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${frankRuhl.variable} ${heebo.variable}`}>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:bg-foreground focus:text-background focus:rounded-md focus:px-3 focus:py-2"
        >
          דלג לתוכן המרכזי
        </a>
        {children}
      </body>
    </html>
  );
}
