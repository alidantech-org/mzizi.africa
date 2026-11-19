import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { TenderListSummaryByStatus } from "#/modules/insights/schema/interface/tender-list-summary-by-status.interface.ts";
import type { TenderListSummaryTransparency } from "#/modules/insights/schema/interface/tender-list-summary-transparency.interface.ts";

/** Tender List Summary */
export interface TenderListSummary {
  byStatus: TenderListSummaryByStatus[];
  total: Number;
  transparency: TenderListSummaryTransparency;
}
