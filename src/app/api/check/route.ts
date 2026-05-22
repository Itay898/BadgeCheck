import { NextRequest, NextResponse } from "next/server";

const RESOURCE_ID = "c8b9f9c8-4612-4068-934f-d4acd2e3c06e";
const CKAN_ENDPOINT = "https://data.gov.il/api/3/action/datastore_search";

/**
 * Field names exactly as they appear in the data.gov.il dataset
 * "כלי רכב עם תג חניה לנכה" — note the spaces (not underscores).
 * The public dataset contains only these three columns; it has no
 * owner name and no expiry date.
 */
const FIELD_PLATE = "MISPAR RECHEV";
const FIELD_ISSUE_DATE = "TAARICH HAFAKAT TAG";
const FIELD_BADGE_TYPE = "SUG TAV";

/** Converts a YYYYMMDD value (e.g. 20230419) to an ISO date string (2023-04-19). */
function formatIssueDate(raw: unknown): string | null {
  const digits = String(raw ?? "").trim();
  if (!/^\d{8}$/.test(digits)) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export async function GET(request: NextRequest) {
  const plate = request.nextUrl.searchParams.get("plate");
  if (!plate) {
    return NextResponse.json({ error: "Missing plate parameter" }, { status: 400 });
  }

  // Israeli plates are numeric and the dataset stores the plate as a number,
  // so strip any formatting and match on the numeric value.
  const digitsOnly = plate.replace(/\D/g, "");
  if (!digitsOnly) {
    return NextResponse.json({
      plateNumber: plate,
      isVerified: false,
      issueDate: null,
      badgeType: null,
      checkedAt: new Date().toISOString(),
      errorMessage: "מספר רכב לא תקין. הזינו ספרות בלבד.",
    });
  }

  try {
    // Exact match on the numeric plate field — far more reliable than a
    // free-text `q` search, which can return partial / unrelated rows.
    const filters = JSON.stringify({ [FIELD_PLATE]: Number(digitsOnly) });
    const url = `${CKAN_ENDPOINT}?resource_id=${RESOURCE_ID}&filters=${encodeURIComponent(
      filters
    )}&limit=1`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from data.gov.il" }, { status: 502 });
    }
    const data = await res.json();
    const records: Record<string, unknown>[] = data?.result?.records ?? [];
    const match = records[0];

    return NextResponse.json({
      plateNumber: plate,
      isVerified: Boolean(match),
      issueDate: match ? formatIssueDate(match[FIELD_ISSUE_DATE]) : null,
      badgeType:
        match && match[FIELD_BADGE_TYPE] != null ? String(match[FIELD_BADGE_TYPE]) : null,
      checkedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
