import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Statistics Breakdowns Language */
export interface PlaceStatisticsBreakdownsLanguage {
  label: string;
  share: number;
  value: number;
}

/** Field metadata for forms and results. */
export const PlaceStatisticsBreakdownsLanguageFields: readonly FieldMeta[] = [
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "share", label: "Share", kind: "number", required: true },
  { name: "value", label: "Value", kind: "number", required: true },
];
