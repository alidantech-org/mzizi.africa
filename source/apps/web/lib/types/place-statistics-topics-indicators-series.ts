import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Place Statistics Topics Indicators Series */
export interface PlaceStatisticsTopicsIndicatorsSeries {
  estimated: boolean;
  period: string;
  value: number;
}

/** Field metadata for forms and results. */
export const PlaceStatisticsTopicsIndicatorsSeriesFields: readonly FieldMeta[] = [
  { name: "estimated", label: "Estimated", kind: "boolean", required: true },
  { name: "period", label: "Period", kind: "string", required: true },
  { name: "value", label: "Value", kind: "number", required: true },
];
