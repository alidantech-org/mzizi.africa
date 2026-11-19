import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Elections Registration Trend */
export interface PlaceElectionsRegistrationTrend {
  estimated: boolean;
  period: string;
  value: number;
}

/** Field metadata for forms and results. */
export const PlaceElectionsRegistrationTrendFields: readonly FieldMeta[] = [
  { name: "estimated", label: "Estimated", kind: "boolean", required: true },
  { name: "period", label: "Period", kind: "string", required: true },
  { name: "value", label: "Value", kind: "number", required: true },
];
