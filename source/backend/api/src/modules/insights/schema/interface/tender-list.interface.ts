import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { TenderListSummary } from "#/modules/insights/schema/interface/tender-list-summary.interface.ts";
import type { TenderListTenders } from "#/modules/insights/schema/interface/tender-list-tenders.interface.ts";

/** Tender List */
export interface TenderList {
  gaps: NonEmptyString500[];
  summary: TenderListSummary;
  tenders: TenderListTenders[];
}
