import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type CompareOptionsHierarchy } from "#/lib/types/compare-options-hierarchy.ts";
import { type CompareOptionsMetrics } from "#/lib/types/compare-options-metrics.ts";
import { type CompareOptionsNearby } from "#/lib/types/compare-options-nearby.ts";
import { type CompareOptionsPlace } from "#/lib/types/compare-options-place.ts";
import { type CompareOptionsTop } from "#/lib/types/compare-options-top.ts";

/** Compare Options */
export interface CompareOptions {
  gaps: string[];
  hierarchy: CompareOptionsHierarchy[];
  metrics: CompareOptionsMetrics[];
  nearby: CompareOptionsNearby[];
  place: CompareOptionsPlace;
  top: CompareOptionsTop[];
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
