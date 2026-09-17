import { sources } from "@/content/site";

/**
 * Aggregate statistics for the public badge dataset, read live from CKAN.
 *
 * Nobody else in this category can publish these numbers credibly: the
 * official portal answers AI crawlers with a 403, competitors have no data
 * layer, and the one law-firm guide that tries has no access to the table.
 * We already query it on every check.
 *
 * On counting honestly: CKAN's unfiltered `total` is a Postgres row estimate —
 * it reports `total_was_estimated: true` and drifts by tens of rows between
 * calls. The per-type counts returned for a filtered query are exact. So the
 * total here is the SUM of the exact per-type counts, never the estimate, and
 * `mayBeIncomplete` flags the one case that would invalidate that: a badge
 * type code we don't know about.
 */

const CKAN = "https://data.gov.il/api/3/action/datastore_search";
const FIELD_BADGE_TYPE = "SUG TAV";
const FIELD_ISSUE_DATE = "TAARICH HAFAKAT TAG";

/**
 * Cache lifetime is deliberately NOT set here.
 *
 * Next.js takes the minimum of a route's `revalidate` and that of the fetches
 * inside it, so a number in both places means the shorter one silently wins
 * and the freshness the page documents is not the one it gets. Leaving the
 * fetches unannotated lets them inherit the calling route's segment config,
 * which keeps the window in exactly one place — `revalidate` in
 * `app/(site)/dataset/page.tsx`. (It has to live there as a literal: Next
 * statically analyses that export and rejects an imported constant.)
 */

/**
 * Badge type codes seen in the table. The dataset publishes the code with no
 * legend, so these are the values observed — not a documented enumeration.
 * `probe` below re-checks for anything outside this list.
 */
const KNOWN_BADGE_TYPES = [1, 2] as const;

/** Codes to probe for beyond the known ones, to catch a newly introduced type. */
const PROBE_BADGE_TYPES = [3, 4, 5] as const;

/** How far the estimated total may drift from our exact sum before we flag it. */
const ESTIMATE_TOLERANCE = 0.02;

export type BadgeTypeCount = {
  /** The raw `SUG TAV` code as published. */
  code: number;
  /** Exact number of vehicles carrying this code. */
  count: number;
  /** Share of the total, 0-1. */
  share: number;
};

export type DatasetStats = {
  /** Sum of the exact per-type counts. */
  total: number;
  byType: BadgeTypeCount[];
  /** Earliest issue date present, ISO (YYYY-MM-DD). */
  earliestIssue: string | null;
  /** Most recent issue date present, ISO. Doubles as a freshness signal. */
  latestIssue: string | null;
  /** True if a badge type code outside the known list appeared, so `total` may undercount. */
  mayBeIncomplete: boolean;
  /** When these numbers were read. */
  readAt: string;
};

/** Converts a YYYYMMDD value (e.g. 20230419) to an ISO date string. */
function toIsoDate(raw: unknown): string | null {
  const digits = String(raw ?? "").trim();
  if (!/^\d{8}$/.test(digits)) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

type CkanResult = {
  result?: {
    total?: number;
    records?: Record<string, unknown>[];
  };
};

async function ckan(params: Record<string, string>): Promise<CkanResult> {
  const query = new URLSearchParams({
    resource_id: sources.datasetResourceId,
    ...params,
  });
  const res = await fetch(`${CKAN}?${query}`);
  if (!res.ok) throw new Error(`CKAN responded ${res.status}`);
  return (await res.json()) as CkanResult;
}

/** Exact row count for one badge type code. */
async function countByType(code: number): Promise<number> {
  const data = await ckan({
    limit: "0",
    filters: JSON.stringify({ [FIELD_BADGE_TYPE]: code }),
  });
  return data.result?.total ?? 0;
}

/** Oldest or newest issue date in the table. */
async function edgeIssueDate(direction: "asc" | "desc"): Promise<string | null> {
  const data = await ckan({
    limit: "1",
    sort: `"${FIELD_ISSUE_DATE}" ${direction}`,
  });
  const record = data.result?.records?.[0];
  return record ? toIsoDate(record[FIELD_ISSUE_DATE]) : null;
}

/**
 * Reads the dataset's aggregate figures.
 *
 * Returns null rather than throwing when data.gov.il is unreachable — the page
 * that renders this is a content page, and a portal outage should degrade it
 * to prose, not 500 it.
 */
export async function getDatasetStats(): Promise<DatasetStats | null> {
  try {
    const [knownCounts, probeCounts, earliestIssue, latestIssue, estimateResult] =
      await Promise.all([
        Promise.all(KNOWN_BADGE_TYPES.map(countByType)),
        Promise.all(PROBE_BADGE_TYPES.map(countByType)),
        edgeIssueDate("asc"),
        edgeIssueDate("desc"),
        ckan({ limit: "0" }),
      ]);

    const total = knownCounts.reduce((sum, n) => sum + n, 0);
    if (total === 0) return null;

    const byType: BadgeTypeCount[] = KNOWN_BADGE_TYPES.map((code, i) => ({
      code,
      count: knownCounts[i],
      share: knownCounts[i] / total,
    }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count);

    // Two independent ways our sum could be wrong: a probed code came back
    // non-zero (a new badge type exists), or CKAN's own estimate has drifted
    // far enough from our sum that something else is going on.
    const foundUnknownType = probeCounts.some((n) => n > 0);
    const estimated = estimateResult.result?.total ?? total;
    const estimateDrift = Math.abs(estimated - total) / total;

    return {
      total,
      byType,
      earliestIssue,
      latestIssue,
      mayBeIncomplete: foundUnknownType || estimateDrift > ESTIMATE_TOLERANCE,
      readAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn("[dataset-stats] could not read data.gov.il:", error);
    return null;
  }
}
