import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";
import { type PlaceStatisticsBreakdowns } from "#/lib/types/place-statistics-breakdowns.ts";
import { type PlaceStatisticsComparisons } from "#/lib/types/place-statistics-comparisons.ts";
import { type PlaceStatisticsSiblings } from "#/lib/types/place-statistics-siblings.ts";
import { type PlaceStatisticsTopics } from "#/lib/types/place-statistics-topics.ts";

/** Place Statistics */
export interface PlaceStatistics {
  breakdowns: PlaceStatisticsBreakdowns;
  chain: PlaceCrumb[];
  comparisons: PlaceStatisticsComparisons[];
  gaps: string[];
  place: PlaceCrumb;
  siblings: PlaceStatisticsSiblings;
  topics: PlaceStatisticsTopics[];
}

/** Field metadata for forms and results. */
export const PlaceStatisticsFields: readonly FieldMeta[] = [
  { name: "breakdowns", label: "Breakdowns", kind: "other", required: true },
  { name: "chain", label: "Chain", kind: "other", required: true },
  { name: "comparisons", label: "Comparisons", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "siblings", label: "Siblings", kind: "other", required: true },
  { name: "topics", label: "Topics", kind: "other", required: true },
];
