import type { InsightsComparisonA } from "#sdk/types/insights/comparison-a.ts";
import type { InsightsComparisonB } from "#sdk/types/insights/comparison-b.ts";
import type { InsightsComparisonRows } from "#sdk/types/insights/comparison-rows.ts";

/** Comparison */
export interface InsightsComparison {
  a: InsightsComparisonA;
  b: InsightsComparisonB;
  gaps: string[];
  rows: InsightsComparisonRows[];
}
