import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Compare Options */
export interface CompareOptions {
  gaps: string[];
  hierarchy: unknown[];
  metrics: unknown[];
  nearby: unknown[];
  place: unknown;
  top: unknown[];
}

/** Field metadata for forms and results. */
export const CompareOptionsFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "hierarchy", label: "Hierarchy", kind: "other", required: true },
  { name: "metrics", label: "Metrics", kind: "other", required: true },
  { name: "nearby", label: "Nearby", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "top", label: "Top", kind: "other", required: true },
];
