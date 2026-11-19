import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PlaceCrumb } from "#/_archives/lib/types/place-crumb";
import { type PlaceStatisticsBreakdowns } from "#/_archives/lib/types/place-statistics-breakdowns";
import { type PlaceStatisticsComparisons } from "#/_archives/lib/types/place-statistics-comparisons";
import { type PlaceStatisticsSiblings } from "#/_archives/lib/types/place-statistics-siblings";
import { type PlaceStatisticsTopics } from "#/_archives/lib/types/place-statistics-topics";

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
