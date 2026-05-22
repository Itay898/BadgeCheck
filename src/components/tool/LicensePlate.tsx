import { cn } from "@/lib/utils";

type LicensePlateProps = {
  /** The plate digits to display (with or without dashes). */
  plate: string;
  className?: string;
};

/**
 * Visual representation of an Israeli vehicle license plate — the blue "IL"
 * strip followed by the plate digits in a heavy mono face.
 *
 * Always rendered LTR so the strip stays on the left like a physical plate,
 * regardless of the surrounding page direction. Shared by the homepage check
 * widget and the AI-rendered chat result so the two never drift apart.
 */
export function LicensePlate({ plate, className }: LicensePlateProps) {
  return (
    <div
      dir="ltr"
      className={cn(
        "inline-flex items-stretch rounded-md overflow-hidden bg-white shadow-sm",
        className
      )}
    >
      <div
        aria-hidden
        className="bg-blue-700 text-white px-2 py-1.5 grid place-items-center text-[10px] font-bold tracking-widest"
        style={{ writingMode: "vertical-rl" }}
      >
        IL
      </div>
      <div className="font-mono text-xl sm:text-2xl font-black text-gray-900 px-4 py-1.5 tracking-[0.22em]">
        {plate}
      </div>
    </div>
  );
}
