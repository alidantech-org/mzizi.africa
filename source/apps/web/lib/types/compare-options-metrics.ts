import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Compare Options Metrics */
export interface CompareOptionsMetrics {
  code: string;
  describe: string;
  domain: string;
  higherIsBetter: boolean;
  title: string;
  unit: string;
}

/** Field metadata for forms and results. */
export const CompareOptionsMetricsFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "describe", label: "Describe", kind: "string", required: true },
  { name: "domain", label: "Domain", kind: "string", required: true },
  { name: "higherIsBetter", label: "Higher Is Better", kind: "boolean", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "unit", label: "Unit", kind: "string", required: true },
];
