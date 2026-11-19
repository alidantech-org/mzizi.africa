import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PlaceStatisticsTopicsIndicators } from "#/_archives/lib/types/place-statistics-topics-indicators";

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
