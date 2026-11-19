import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Indicator Series Indicator */
export interface IndicatorSeriesIndicator {
  code: string;
  description: string;
  higherIsBetter?: boolean | null;
  name: string;
  unit: string;
}

/** Field metadata for forms and results. */
export const IndicatorSeriesIndicatorFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "description", label: "Description", kind: "string", required: true },
  {
    name: "higherIsBetter",
    label: "Higher Is Better",
    kind: "boolean",
    required: false,
  },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "string", required: true },
];
