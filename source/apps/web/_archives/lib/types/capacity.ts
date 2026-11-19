import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Capacity */
export interface Capacity {
  indicatorCode: string;
  label: string;
  value: number;
}

/** Field metadata for forms and results. */
export const CapacityFields: readonly FieldMeta[] = [
  {
    name: "indicatorCode",
    label: "Indicator Code",
    kind: "string",
    required: true,
  },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "value", label: "Value", kind: "number", required: true },
];
