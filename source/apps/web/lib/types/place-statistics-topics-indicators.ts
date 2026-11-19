import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceStatisticsTopicsIndicatorsLatest } from "#/lib/types/place-statistics-topics-indicators-latest.ts";
import { type PlaceStatisticsTopicsIndicatorsPrevious } from "#/lib/types/place-statistics-topics-indicators-previous.ts";
import { type PlaceStatisticsTopicsIndicatorsSeries } from "#/lib/types/place-statistics-topics-indicators-series.ts";

/** Place Statistics Topics Indicators */
export interface PlaceStatisticsTopicsIndicators {
  change?: number | null;
  code: string;
  higherIsBetter?: boolean | null;
  latest: PlaceStatisticsTopicsIndicatorsLatest;
  measure: string;
  name: string;
  previous?: PlaceStatisticsTopicsIndicatorsPrevious | null;
  role?: string | null;
  series: PlaceStatisticsTopicsIndicatorsSeries[];
  unit: string;
}

/** Field metadata for forms and results. */
export const PlaceStatisticsTopicsIndicatorsFields: readonly FieldMeta[] = [
  { name: "change", label: "Change", kind: "number", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "higherIsBetter", label: "Higher Is Better", kind: "boolean", required: false },
  { name: "latest", label: "Latest", kind: "other", required: true },
  { name: "measure", label: "Measure", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "previous", label: "Previous", kind: "other", required: false },
  { name: "role", label: "Role", kind: "string", required: false },
  { name: "series", label: "Series", kind: "other", required: true },
  { name: "unit", label: "Unit", kind: "string", required: true },
];
