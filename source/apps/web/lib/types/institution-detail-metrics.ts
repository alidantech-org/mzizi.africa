import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Institution Detail Metrics */
export interface InstitutionDetailMetrics {
  label: string;
  value: number;
}

/** Field metadata for forms and results. */
export const InstitutionDetailMetricsFields: readonly FieldMeta[] = [
  { name: "label", label: "Label", kind: "string", required: true },
  { name: "value", label: "Value", kind: "number", required: true },
];
