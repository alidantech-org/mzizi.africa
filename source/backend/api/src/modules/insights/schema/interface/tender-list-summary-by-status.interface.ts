import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Tender List Summary By Status */
export interface TenderListSummaryByStatus {
  count: Number;
  status: String;
  valueKes: Number;
}
