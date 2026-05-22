import { Keyboard, Database, ShieldCheck } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Keyboard,
    title: "מזינים מספר רכב",
    body: "מספר רכב ישראלי, עם או בלי מקפים. אנחנו לא שומרים את המספר ולא משייכים אותו לזהותכם.",
  },
  {
    n: "02",
    icon: Database,
    title: "בודקים מול המקור הציבורי",
    body: "השאילתה רצה בזמן אמת מול מאגר המידע הפתוח של ממשלת ישראל (data.gov.il).",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "מקבלים תוצאה ברורה",
    body: "האם נמצא רישום תו תקף, ואיזה פרטים זמינים. תוצאה לא חיובית מוסברת — בלי לנחש.",
  },
] as const;

export function HowItWorks() {
  return (
    <ol className="grid gap-4 sm:gap-5 sm:grid-cols-3">
      {steps.map(({ n, icon: Icon, title, body }) => (
        <li
          key={n}
          className="relative rounded-2xl border border-border bg-card p-5 sm:p-6 hover:shadow-[var(--elev-2)] transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <span
              aria-hidden
              className="inline-grid place-items-center h-10 w-10 rounded-xl bg-brand-soft text-brand-strong"
            >
              <Icon size={18} />
            </span>
            <span
              aria-hidden
              className="text-2xl font-extrabold tabular-nums text-foreground/15 tracking-tight"
            >
              {n}
            </span>
          </div>
          <h3 className="mt-5 text-[17px] font-bold leading-tight tracking-tight">
            {title}
          </h3>
          <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">
            {body}
          </p>
        </li>
      ))}
    </ol>
  );
}
