import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Indicator Map Indicator */
export interface IndicatorMapIndicator {
  code: string;
  higherIsBetter?: boolean | null;
  name: string;
  unit: string;
}

/** Field metadata for forms and results. */
export const IndicatorMapIndicatorFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "higherIsBetter", label: "Higher Is Better", kind: "boolean", required: false },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "string", required: true },
];
