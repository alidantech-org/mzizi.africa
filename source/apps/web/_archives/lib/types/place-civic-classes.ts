import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Civic Classes */
export interface PlaceCivicClasses {
  amount: number;
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const PlaceCivicClassesFields: readonly FieldMeta[] = [
  { name: "amount", label: "Amount", kind: "number", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
