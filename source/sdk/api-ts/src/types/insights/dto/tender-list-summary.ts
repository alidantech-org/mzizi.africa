import type { InsightsTenderListSummaryByStatus } from "#sdk/types/insights/dto/tender-list-summary-by-status.ts";
import type { InsightsTenderListSummaryTransparency } from "#sdk/types/insights/dto/tender-list-summary-transparency.ts";

/** Tender List Summary */
export interface InsightsTenderListSummary {
  byStatus: InsightsTenderListSummaryByStatus[];
  total: number;
  transparency: InsightsTenderListSummaryTransparency;
}
