import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

/**
 * Compact CTA dropped inside article bodies.
 * Links to the homepage checker — does not embed the widget to keep article
 * pages light and free of client JS for the form itself.
 */
export function InlineCheckCallout() {
  return (
    <aside className="not-prose my-10 rounded-2xl border border-brand/15 bg-brand-soft/55 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="hidden sm:inline-grid place-items-center h-10 w-10 rounded-xl bg-brand text-white shrink-0"
        >
          <ShieldCheck size={18} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="inline-flex items-center rounded-full bg-card text-brand-strong text-[12px] font-semibold py-1 px-2.5">
            כלי הבדיקה
          </p>
          <h3 className="mt-1 text-lg sm:text-xl font-bold leading-tight tracking-tight">
            רוצים לבדוק תו לרכב ספציפי?
          </h3>
          <p className="mt-1.5 text-[14.5px] text-foreground/80 leading-relaxed max-w-[55ch]">
            השאילתה רצה מול data.gov.il בזמן אמת. בלי הרשמה, בלי שמירת מספרי רכב.
          </p>
          <div className="mt-4">
            <Link
              href="/#check"
              className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-5 h-10 text-sm font-semibold hover:bg-brand-strong transition-colors shadow-[var(--elev-1)]"
            >
              לבדיקה
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
