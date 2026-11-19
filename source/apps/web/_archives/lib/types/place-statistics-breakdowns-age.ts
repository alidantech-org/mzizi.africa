import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Statistics Breakdowns Age */
export interface PlaceStatisticsBreakdownsAge {
  label: string;
  share: number;
  value: number;
}

/** Field metadata for forms and results. */
export const PlaceStatisticsBreakdownsAgeFields: readonly FieldMeta[] = [
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "share", label: "Share", kind: "number", required: true },
  { name: "value", label: "Value", kind: "number", required: true },
];
