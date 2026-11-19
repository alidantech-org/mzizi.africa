import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceStatisticsTopicsIndicators } from "#/lib/types/place-statistics-topics-indicators.ts";

/** Place Statistics Topics */
export interface PlaceStatisticsTopics {
  code: string;
  indicators: PlaceStatisticsTopicsIndicators[];
  label: string;
}

/** Field metadata for forms and results. */
export const PlaceStatisticsTopicsFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "indicators", label: "Indicators", kind: "other", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
