import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { CompareOptionsHierarchy } from "#/modules/insights/schema/interface/compare-options-hierarchy.interface.ts";
import type { CompareOptionsMetrics } from "#/modules/insights/schema/interface/compare-options-metrics.interface.ts";
import type { CompareOptionsNearby } from "#/modules/insights/schema/interface/compare-options-nearby.interface.ts";
import type { CompareOptionsPlace } from "#/modules/insights/schema/interface/compare-options-place.interface.ts";
import type { CompareOptionsTop } from "#/modules/insights/schema/interface/compare-options-top.interface.ts";

/** Compare Options */
export interface CompareOptions {
  gaps: NonEmptyString500[];
  hierarchy: CompareOptionsHierarchy[];
  metrics: CompareOptionsMetrics[];
  nearby: CompareOptionsNearby[];
  place: CompareOptionsPlace;
  top: CompareOptionsTop[];
}
