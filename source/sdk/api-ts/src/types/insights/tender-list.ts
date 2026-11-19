import type { InsightsTenderListSummary } from "#sdk/types/insights/tender-list-summary.ts";
import type { InsightsTenderListTenders } from "#sdk/types/insights/tender-list-tenders.ts";

/** Tender List */
export interface InsightsTenderList {
  gaps: string[];
  summary: InsightsTenderListSummary;
  tenders: InsightsTenderListTenders[];
}
