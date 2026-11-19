import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type CompareOptionsHierarchy } from "#/_archives/lib/types/compare-options-hierarchy";
import { type CompareOptionsMetrics } from "#/_archives/lib/types/compare-options-metrics";
import { type CompareOptionsNearby } from "#/_archives/lib/types/compare-options-nearby";
import { type CompareOptionsPlace } from "#/_archives/lib/types/compare-options-place";
import { type CompareOptionsTop } from "#/_archives/lib/types/compare-options-top";

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
