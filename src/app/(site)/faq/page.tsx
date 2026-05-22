import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Container } from "@/components/site/Container";
import { BreadcrumbJsonLd } from "@/components/editorial/BreadcrumbJsonLd";
import { faqSections, listFaqEntries } from "@/content/faq";

export const metadata: Metadata = {
  title: "שאלות נפוצות על תו נכה",
  description:
    "התשובות הקצרות לשאלות הנפוצות ביותר על תו נכה בישראל. תוקף, חידוש, חניה, זכויות נלוות ועוד.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const allEntries = listFaqEntries();

  // FAQPage structured data — every Q&A is a separate Question node.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "he",
    mainEntity: allEntries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: [...e.answer, ...(e.list ?? [])].join(" "),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "ראשי", path: "/" },
          { name: "שאלות נפוצות", path: "/faq" },
        ]}
      />

      {/* HEAD */}
      <header className="pt-10 sm:pt-14 pb-8 border-b border-border">
        <Container size="narrow">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
            שאלות ותשובות
          </p>
          <h1 className="mt-4 text-[34px] sm:text-[44px] font-bold leading-tight tracking-tight">
            שאלות נפוצות על תו נכה
          </h1>
          <p className="mt-3 text-[16px] text-muted-foreground leading-relaxed max-w-[55ch]">
            תשובות קצרות, מנוסחות בזהירות. כשהתשובה תלויה במדיניות רשמית — אנחנו
            מפנים למקור הרשמי המתאים, ולא ממציאים מספרים או תאריכים.
          </p>
        </Container>
      </header>

      {/* CONTENT */}
      <div className="py-10 sm:py-14">
        <Container size="narrow">
          <div className="grid lg:grid-cols-[1fr_220px] gap-10 lg:gap-12">
            {/* Q&A list */}
            <div>
              {faqSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`section-${section.id}`}
                  className="scroll-mt-24 mb-12 last:mb-0"
                >
                  <h2
                    id={`section-${section.id}`}
                    className="text-[22px] sm:text-[26px] font-bold leading-tight tracking-tight"
                  >
                    {section.title}
                  </h2>
                  {section.intro && (
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {section.intro}
                    </p>
                  )}

                  <div className="mt-6 divide-y divide-border border-y border-border">
                    {section.entries.map((entry) => (
                      <article
                        key={entry.id}
                        id={entry.id}
                        className="py-6 scroll-mt-24"
                      >
                        <h3 className="group flex items-baseline gap-2 text-[17px] sm:text-lg font-bold leading-snug tracking-tight">
                          <a
                            href={`#${entry.id}`}
                            aria-label={`קישור ישיר לשאלה: ${entry.question}`}
                            // Visible by default (touch devices have no hover);
                            // fades up on hover/focus on pointer devices.
                            className="text-muted-foreground/60 hover:text-brand focus:text-brand transition-colors text-base font-normal"
                          >
                            #
                          </a>
                          <span>{entry.question}</span>
                        </h3>
                        <div className="mt-3 space-y-3 text-[15.5px] leading-relaxed text-foreground/85">
                          {entry.answer.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                          {entry.list && entry.list.length > 0 && (
                            <ul className="list-disc ps-5 space-y-1.5">
                              {entry.list.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          )}
                          {entry.source && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">למקור: </span>
                              {entry.source}
                            </p>
                          )}
                          {entry.cta && (
                            <p>
                              <Link
                                href={entry.cta.href}
                                className="inline-flex items-center gap-1.5 text-brand font-semibold hover:underline underline-offset-4"
                              >
                                {entry.cta.label}
                                <ArrowLeft size={14} />
                              </Link>
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}

              {/* Bottom checker CTA */}
              <div className="mt-12 rounded-2xl border border-brand/15 bg-brand-soft/55 p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="hidden sm:inline-grid place-items-center h-10 w-10 rounded-xl bg-brand text-white shrink-0"
                  >
                    <ShieldCheck size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold leading-tight tracking-tight">
                      לא מצאתם תשובה? אפשר לבדוק תו ספציפי עכשיו
                    </h3>
                    <p className="mt-2 text-[14.5px] text-foreground/80 leading-relaxed">
                      הכלי עובד מול data.gov.il. בלי הרשמה, בלי שמירת מספרי רכב.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/#check"
                        className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-5 h-10 text-sm font-semibold hover:bg-brand-strong transition-colors shadow-[var(--elev-1)]"
                      >
                        לבדיקת תו
                        <ArrowLeft size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky ToC (desktop only) */}
            <aside className="hidden lg:block">
              <nav
                aria-label="תוכן עניינים"
                className="sticky top-24 text-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  ניווט מהיר
                </p>
                <ol className="space-y-2">
                  {faqSections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block text-foreground/80 hover:text-foreground transition-colors"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          </div>
        </Container>
      </div>
    </>
  );
}
