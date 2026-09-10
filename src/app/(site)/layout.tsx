import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteMotionConfig } from "@/components/site/SiteMotionConfig";
import { SiteJsonLd } from "@/components/site/SiteJsonLd";
import { SiteAdsense } from "@/components/site/SiteAdsense";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteMotionConfig>
      <SiteJsonLd />
      <SiteHeader />
      <main id="main" className="min-h-[calc(100vh-64px)]">
        {children}
      </main>
      <SiteFooter />
      <SiteAdsense />
    </SiteMotionConfig>
  );
}
