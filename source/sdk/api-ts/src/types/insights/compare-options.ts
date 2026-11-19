import type { InsightsCompareOptionsHierarchy } from "#sdk/types/insights/compare-options-hierarchy.ts";
import type { InsightsCompareOptionsMetrics } from "#sdk/types/insights/compare-options-metrics.ts";
import type { InsightsCompareOptionsNearby } from "#sdk/types/insights/compare-options-nearby.ts";
import type { InsightsCompareOptionsPlace } from "#sdk/types/insights/compare-options-place.ts";
import type { InsightsCompareOptionsTop } from "#sdk/types/insights/compare-options-top.ts";

/** Compare Options */
export interface InsightsCompareOptions {
  gaps: string[];
  hierarchy: InsightsCompareOptionsHierarchy[];
  metrics: InsightsCompareOptionsMetrics[];
  nearby: InsightsCompareOptionsNearby[];
  place: InsightsCompareOptionsPlace;
  top: InsightsCompareOptionsTop[];
}
