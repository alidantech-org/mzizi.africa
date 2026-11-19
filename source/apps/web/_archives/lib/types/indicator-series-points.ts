import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Indicator Series Points */
export interface IndicatorSeriesPoints {
  estimated: boolean;
  period: string;
  value: number;
}

/** Field metadata for forms and results. */
export const IndicatorSeriesPointsFields: readonly FieldMeta[] = [
  { name: "estimated", label: "Estimated", kind: "boolean", required: true },
  { name: "period", label: "Period", kind: "string", required: true },
  { name: "value", label: "Value", kind: "number", required: true },
];
