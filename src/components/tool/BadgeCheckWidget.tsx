"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ShieldCheck, ShieldX, AlertTriangle, RotateCcw } from "lucide-react";
import { checkVehicleBadge } from "@/services/badge-check";
import { LicensePlate } from "@/components/tool/LicensePlate";
import { cn } from "@/lib/utils";

type ResultState =
  | { status: "idle" }
  | { status: "loading"; plate: string }
  | {
      status: "verified" | "not-found";
      plate: string;
      issueDate?: string | null;
      badgeType?: string | null;
      checkedAt: string;
    }
  | { status: "error"; plate: string; message: string };

const PLATE_REGEX = /^[\d-]{5,10}$/;

const dateFmt = new Intl.DateTimeFormat("he-IL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatHebrewDate(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFmt.format(d);
}

/** Short, plain-Hebrew summary for the polite live region. */
function srAnnouncement(state: ResultState): string {
  switch (state.status) {
    case "idle":
      return "";
    case "loading":
      return `בודק את תוקף תו הנכה עבור רכב ${state.plate}.`;
    case "verified":
      return `נמצא תו נכה תקף עבור רכב ${state.plate}.`;
    case "not-found":
      return `לא נמצא תו נכה תקף עבור רכב ${state.plate}.`;
    case "error":
      return `שגיאה בבדיקה: ${state.message}`;
  }
}

export function BadgeCheckWidget({ embedded = false }: { embedded?: boolean }) {
  const [plate, setPlate] = useState("");
  const [state, setState] = useState<ResultState>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  // When transitioning into the error state, return focus to the input so
  // keyboard / screen-reader users can correct the value immediately.
  useEffect(() => {
    if (state.status === "error") {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [state.status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = plate.trim();
    // Reject blanks, malformed values, and dash-only strings like "-----".
    const digitsOnly = cleaned.replace(/-/g, "");
    if (!PLATE_REGEX.test(cleaned) || digitsOnly.length < 5) {
      setState({
        status: "error",
        plate: cleaned || "—",
        message: "מספר הרכב לא תקין. הזינו 5–8 ספרות, עם או בלי מקפים.",
      });
      return;
    }
    setState({ status: "loading", plate: cleaned });
    try {
      const data = await checkVehicleBadge({ plate: cleaned });
      if (data.errorMessage) {
        setState({ status: "error", plate: cleaned, message: data.errorMessage });
        return;
      }
      setState({
        status: data.isVerified ? "verified" : "not-found",
        plate: data.plateNumber ?? cleaned,
        issueDate: data.issueDate,
        badgeType: data.badgeType,
        checkedAt: data.checkedAt ?? new Date().toISOString(),
      });
    } catch {
      setState({
        status: "error",
        plate: cleaned,
        message: "לא הצלחנו להגיע לשרת. בדקו את החיבור ונסו שוב.",
      });
    }
  }

  function reset() {
    setPlate("");
    setState({ status: "idle" });
    inputRef.current?.focus();
  }

  const loading = state.status === "loading";

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card",
        "shadow-[var(--elev-3)]",
        embedded ? "p-5 sm:p-7" : "p-6 sm:p-8"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-strong text-[12px] font-semibold py-1 px-2.5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
            כלי הבדיקה
          </p>
          <h2 className="mt-2.5 text-[22px] sm:text-2xl leading-tight font-bold tracking-tight">
            בדיקת תוקף תו
          </h2>
          <p className="mt-2 text-[13.5px] text-muted-foreground max-w-[42ch] leading-relaxed">
            הזינו מספר רכב ישראלי ונבדוק מול מאגר המידע הציבורי של ממשלת ישראל.
          </p>
        </div>
        <span
          aria-hidden
          className="hidden sm:inline-grid place-items-center h-10 w-10 rounded-xl bg-brand text-white shrink-0"
        >
          <ShieldCheck size={18} />
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <label htmlFor="plate-input" className="sr-only">
          מספר רכב
        </label>
        <div className="grid grid-cols-[1fr_auto] gap-2 sm:gap-3 items-stretch">
          <div className="relative">
            <input
              ref={inputRef}
              id="plate-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              dir="ltr"
              maxLength={10}
              value={plate}
              onChange={(e) => setPlate(e.target.value.replace(/[^0-9-]/g, ""))}
              placeholder="12-345-67"
              className="w-full h-14 rounded-xl border-2 border-border bg-background px-4 text-2xl font-mono font-black tracking-[0.18em] text-center placeholder:text-muted-foreground/40 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/15 transition"
              aria-invalid={state.status === "error"}
              aria-describedby={state.status === "error" ? "plate-status" : undefined}
            />
          </div>
          <button
            type="submit"
            disabled={loading || plate.length < 5}
            className="h-14 px-6 sm:px-7 rounded-xl bg-brand text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-brand-strong transition-colors inline-flex items-center justify-center gap-2 min-w-[7rem] shadow-[var(--elev-1)]"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                בודק
              </>
            ) : (
              "בדיקה"
            )}
          </button>
        </div>
        <p className="text-[12.5px] text-muted-foreground leading-relaxed">
          הבדיקה מבוססת על מאגר data.gov.il ומשקפת את מצבו בזמן הבדיקה. היא אינה
          תחליף למסמך התו הרשמי.
        </p>
      </form>

      {/* SR-only live region: announces the current result as a plain sentence */}
      <div
        id="plate-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {srAnnouncement(state)}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {state.status !== "idle" && (
          <motion.div
            key={state.status + ("plate" in state ? state.plate : "")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-6"
          >
            {state.status === "loading" && (
              <div className="rounded-xl border border-border bg-muted/40 p-4 flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 size={16} className="animate-spin" />
                בודק מול מאגר המידע הציבורי…
              </div>
            )}

            {state.status === "verified" && (
              <ResultCard
                tone="success"
                icon={<ShieldCheck size={22} />}
                title="תו נכה תקף"
                plate={state.plate}
                checkedAt={state.checkedAt}
                rows={[
                  state.badgeType && { label: "סוג תג", value: state.badgeType },
                  state.issueDate && {
                    label: "תאריך הנפקה",
                    value: formatHebrewDate(state.issueDate) ?? state.issueDate,
                  },
                ].filter(Boolean) as { label: string; value: string }[]}
                onReset={reset}
              />
            )}

            {state.status === "not-found" && (
              <ResultCard
                tone="warning"
                icon={<ShieldX size={22} />}
                title="לא נמצא תו נכה תקף"
                plate={state.plate}
                checkedAt={state.checkedAt}
                description="לא מצאנו רשומה תקפה. ייתכן שהתו פג, שלא הוזן עדיין, או שמספר הרכב שגוי."
                onReset={reset}
              />
            )}

            {state.status === "error" && (
              <ResultCard
                tone="error"
                icon={<AlertTriangle size={22} />}
                title="שגיאה בבדיקה"
                plate={state.plate}
                description={state.message}
                onReset={reset}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type ResultCardProps = {
  tone: "success" | "warning" | "error";
  icon: React.ReactNode;
  title: string;
  plate: string;
  description?: string;
  checkedAt?: string;
  rows?: { label: string; value: string }[];
  onReset: () => void;
};

function ResultCard({ tone, icon, title, plate, description, checkedAt, rows, onReset }: ResultCardProps) {
  const toneCls =
    tone === "success"
      ? "border-brand/25 bg-brand-soft/60"
      : tone === "warning"
      ? "border-border bg-paper-2"
      : "border-destructive/25 bg-destructive/5";
  const iconBg =
    tone === "success"
      ? "bg-brand text-white"
      : tone === "warning"
      ? "bg-foreground/10 text-foreground"
      : "bg-destructive/10 text-destructive";

  const time = checkedAt
    ? new Intl.DateTimeFormat("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(checkedAt))
    : null;

  return (
    <div className={cn("rounded-xl border p-5 sm:p-6", toneCls)}>
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className={cn(
            "shrink-0 inline-grid place-items-center h-10 w-10 rounded-full",
            iconBg
          )}
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold leading-tight tracking-tight">
            {title}
          </h3>
          {time && (
            <p className="text-xs text-muted-foreground mt-0.5">נבדק ב־{time}</p>
          )}
          {description && (
            <p className="mt-2 text-[15px] leading-relaxed text-foreground/85 max-w-[55ch]">
              {description}
            </p>
          )}

          <LicensePlate plate={plate} className="mt-4" />

          {rows && rows.length > 0 && (
            <dl className="mt-5 grid sm:grid-cols-2 gap-y-3 sm:gap-y-0 sm:gap-x-6 border-t border-border pt-4">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt className="text-xs text-muted-foreground">{r.label}</dt>
                  <dd className="text-[15px] font-medium text-foreground mt-0.5">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <button
          type="button"
          onClick={onReset}
          aria-label="איפוס הבדיקה"
          className="shrink-0 inline-grid place-items-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
