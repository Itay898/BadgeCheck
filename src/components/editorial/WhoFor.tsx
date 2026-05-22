import { Users, RefreshCw, ClipboardCheck } from "lucide-react";

/**
 * "Who it's for" cards on the homepage — three concrete situations in which
 * a quick badge check is genuinely useful. Audience-framed, not feature-framed.
 */
const audiences = [
  {
    icon: Users,
    title: "מחזיקי תו ובני משפחה",
    body: "בדיקת תוקף מהירה לפני נסיעה או חניה — בלי לחפש את מסמך התו הפיזי.",
  },
  {
    icon: RefreshCw,
    title: "אחרי חידוש או החלפת רכב",
    body: "אימות שהעדכון כבר השתקף במאגר הציבורי, כדי לא להיתקע בהפתעה בדרך.",
  },
  {
    icon: ClipboardCheck,
    title: "לפני פנייה למשרד התחבורה",
    body: "נקודת פתיחה מסודרת — לראות מה הסטטוס הרשום היום לפני שמתחילים תהליך.",
  },
] as const;

export function WhoFor() {
  return (
    <ul className="grid gap-4 sm:gap-5 sm:grid-cols-3">
      {audiences.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="rounded-2xl border border-border bg-card p-5 sm:p-6 hover:shadow-[var(--elev-2)] transition-shadow duration-300"
        >
          <span
            aria-hidden
            className="inline-grid place-items-center h-10 w-10 rounded-xl bg-brand-soft text-brand-strong"
          >
            <Icon size={18} />
          </span>
          <h3 className="mt-5 text-[17px] font-bold leading-tight tracking-tight">
            {title}
          </h3>
          <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">
            {body}
          </p>
        </li>
      ))}
    </ul>
  );
}
