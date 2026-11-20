import type { InsightsComparisonA } from "#sdk/types/insights/dto/comparison-a.ts";
import type { InsightsComparisonB } from "#sdk/types/insights/dto/comparison-b.ts";
import type { InsightsComparisonRows } from "#sdk/types/insights/dto/comparison-rows.ts";

/** Comparison */
export interface InsightsComparison {
  a: InsightsComparisonA;
  b: InsightsComparisonB;
  gaps: string[];
  rows: InsightsComparisonRows[];
}
