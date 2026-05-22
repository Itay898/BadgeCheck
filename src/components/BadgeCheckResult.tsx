"use client";

import { z } from "zod";
import { ShieldCheck, ShieldX, AlertTriangle } from "lucide-react";
import { LicensePlate } from "@/components/tool/LicensePlate";
import { cn } from "@/lib/utils";

export const badgeCheckResultSchema = z.object({
  plateNumber: z.string().describe("The license plate number that was checked"),
  isVerified: z.boolean().describe("Whether the vehicle has a valid disability badge"),
  ownerName: z.string().optional().describe("Name of the badge holder if available"),
  expiryDate: z.string().optional().describe("Badge expiry date in YYYY-MM-DD format if available"),
  badgeType: z.string().optional().describe("Type of disability badge if available"),
  checkedAt: z.string().describe("ISO timestamp of when the check was performed"),
  errorMessage: z.string().optional().describe("Error message if the check failed"),
});

type BadgeCheckResultProps = z.infer<typeof badgeCheckResultSchema>;

type Tone = "success" | "warning" | "error";

/** Card + icon-chip styling per result tone — all values resolve from design tokens. */
const TONE: Record<Tone, { card: string; iconWrap: string }> = {
  success: { card: "border-brand/25 bg-brand-soft/60", iconWrap: "bg-brand text-white" },
  warning: { card: "border-border bg-paper-2", iconWrap: "bg-foreground/10 text-foreground" },
  error: { card: "border-destructive/25 bg-destructive/5", iconWrap: "bg-destructive/10 text-destructive" },
};

const dateFmt = new Intl.DateTimeFormat("he-IL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("he-IL", {
  hour: "2-digit",
  minute: "2-digit",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(iso: string | undefined, fmt: Intl.DateTimeFormat): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : fmt.format(d);
}

export function BadgeCheckResult({
  plateNumber,
  isVerified,
  ownerName,
  expiryDate,
  badgeType,
  checkedAt,
  errorMessage,
}: BadgeCheckResultProps) {
  const plate = plateNumber?.trim() || "—";
  const tone: Tone = errorMessage ? "error" : isVerified ? "success" : "warning";

  const icon =
    tone === "success" ? (
      <ShieldCheck size={22} />
    ) : tone === "warning" ? (
      <ShieldX size={22} />
    ) : (
      <AlertTriangle size={22} />
    );

  const title =
    tone === "success"
      ? "תו נכה תקף"
      : tone === "warning"
      ? "לא נמצא תו נכה תקף"
      : "שגיאה בבדיקה";

  const description =
    tone === "error"
      ? errorMessage
      : tone === "warning"
      ? "לא מצאנו רשומה תקפה במאגר. ייתכן שהתו פג תוקף, שטרם הוזן, או שמספר הרכב שגוי."
      : null;

  const checkedAtLabel = formatDate(checkedAt, dateTimeFmt);

  const rows =
    tone === "success"
      ? ([
          ownerName && { label: "שם בעל התו", value: ownerName },
          badgeType && { label: "סוג תו", value: badgeType },
          expiryDate && { label: "תוקף", value: formatDate(expiryDate, dateFmt) ?? expiryDate },
        ].filter(Boolean) as { label: string; value: string }[])
      : [];

  return (
    <div
      dir="rtl"
      className={cn("rounded-2xl border p-5 sm:p-6 font-sans", TONE[tone].card)}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className={cn(
            "shrink-0 inline-grid place-items-center h-11 w-11 rounded-full",
            TONE[tone].iconWrap
          )}
        >
          {icon}
        </span>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold leading-tight tracking-tight text-foreground">
            {title}
          </h3>
          {checkedAtLabel && (
            <p className="text-xs text-muted-foreground mt-0.5">נבדק ב־{checkedAtLabel}</p>
          )}
          {description && (
            <p className="mt-2 text-[15px] leading-relaxed text-foreground/85 max-w-[55ch]">
              {description}
            </p>
          )}

          <div className="mt-4">
            <LicensePlate plate={plate} />
          </div>

          {rows.length > 0 && (
            <dl className="mt-5 grid sm:grid-cols-3 gap-y-3 sm:gap-y-0 sm:gap-x-6 border-t border-border pt-4">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt className="text-xs text-muted-foreground">{r.label}</dt>
                  <dd className="text-[15px] font-medium text-foreground mt-0.5">{r.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
