import { NextRequest, NextResponse } from "next/server";

const RESOURCE_ID = "c8b9f9c8-4612-4068-934f-d4acd2e3c06e";
const CKAN_ENDPOINT = "https://data.gov.il/api/3/action/datastore_search";

export async function GET(request: NextRequest) {
  const plate = request.nextUrl.searchParams.get("plate");
  if (!plate) {
    return NextResponse.json({ error: "Missing plate parameter" }, { status: 400 });
  }

  const normalized = plate.replace(/-/g, "").toUpperCase();

  try {
    const url = `${CKAN_ENDPOINT}?resource_id=${RESOURCE_ID}&q=${encodeURIComponent(normalized)}&limit=5`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from data.gov.il" }, { status: 502 });
    }
    const data = await res.json();
    const records: Record<string, string>[] = data?.result?.records ?? [];
    const match = records.find((r) => {
      const recPlate = String(r["MISPAR_RECHEV"] ?? r["mispar_rechev"] ?? "").replace(/-/g, "");
      return recPlate === normalized;
    });

    return NextResponse.json({
      plateNumber: plate,
      isVerified: !!match,
      ownerName: match?.["SHEM_BAAL_RECHEV"] ?? match?.["shem_baal_rechev"] ?? null,
      expiryDate: match?.["TAARICH_SAMUY"] ?? match?.["taarich_samuy"] ?? null,
      badgeType: match?.["SUG_TOV"] ?? match?.["sug_tov"] ?? null,
      checkedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
