import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Civic Years Classes */
export interface PlaceCivicYearsClasses {
  amount: number;
  code: string;
  label: string;
  lines: number;
}

/** Field metadata for forms and results. */
export const PlaceCivicYearsClassesFields: readonly FieldMeta[] = [
  { name: "amount", label: "Amount", kind: "number", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "lines", label: "Lines", kind: "number", required: true },
];
