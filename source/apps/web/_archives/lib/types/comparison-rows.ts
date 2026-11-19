import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Comparison Rows */
export interface ComparisonRows {
  a: number;
  b: number;
  code: string;
  diffPercent?: number | null;
  higherIsBetter: boolean;
  title: string;
  unit: string;
}

/** Field metadata for forms and results. */
export const ComparisonRowsFields: readonly FieldMeta[] = [
  { name: "a", label: "A", kind: "number", required: true },
  { name: "b", label: "B", kind: "number", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  {
    name: "diffPercent",
    label: "Diff Percent",
    kind: "number",
    required: false,
  },
  {
    name: "higherIsBetter",
    label: "Higher Is Better",
    kind: "boolean",
    required: true,
  },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "string", required: true },
];
