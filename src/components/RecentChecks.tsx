"use client";

import { z } from "zod";
import { CheckCircle2, XCircle, History } from "lucide-react";
import { cn } from "@/lib/utils";

export const recentChecksSchema = z.object({
  checks: z.array(
    z.object({
      id: z.string().describe("Unique identifier for this check entry"),
      plateNumber: z.string().describe("The license plate number"),
      isVerified: z.boolean().describe("Whether the vehicle had a valid badge"),
      checkedAt: z.string().describe("ISO timestamp of when the check was performed"),
    })
  ).describe("List of recent badge checks"),
});

type RecentChecksProps = z.infer<typeof recentChecksSchema>;

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (Number.isNaN(minutes)) return "";
  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `לפני ${minutes} דק׳`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `לפני ${hours} שע׳`;
  return `לפני ${Math.floor(hours / 24)} ימים`;
}

export function RecentChecks({ checks }: RecentChecksProps) {
  if (!checks || checks.length === 0) {
    return (
      <div
        dir="rtl"
        className="rounded-2xl border border-border bg-card p-6 text-center font-sans"
      >
        <span
          aria-hidden
          className="inline-grid place-items-center h-11 w-11 rounded-full bg-muted text-muted-foreground"
        >
          <History size={20} />
        </span>
        <p className="mt-3 text-sm font-medium text-foreground">
          אין עדיין בדיקות אחרונות
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          בדיקות שתבצעו יופיעו כאן.
        </p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-border bg-card overflow-hidden font-sans"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-paper-2/60">
        <h3 className="text-sm font-bold tracking-tight text-foreground">
          בדיקות אחרונות
        </h3>
        <span
          aria-label={`${checks.length} בדיקות`}
          className="inline-flex items-center justify-center min-w-[1.5rem] h-5 rounded-full bg-foreground/[0.06] px-1.5 text-[11px] font-semibold text-foreground/70 tabular-nums"
        >
          {checks.length}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {checks.map((check) => (
          <li
            key={check.id}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                aria-hidden
                className={cn(
                  "shrink-0 inline-grid place-items-center h-7 w-7 rounded-full",
                  check.isVerified
                    ? "bg-brand-soft text-brand-strong"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {check.isVerified ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              </span>
              <span
                dir="ltr"
                className="font-mono font-bold tracking-[0.12em] text-foreground truncate"
              >
                {check.plateNumber}
              </span>
            </div>
            <div className="text-end shrink-0">
              <div
                className={cn(
                  "text-xs font-semibold",
                  check.isVerified ? "text-brand-strong" : "text-destructive"
                )}
              >
                {check.isVerified ? "תו תקף" : "לא נמצא"}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {timeAgo(check.checkedAt)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
