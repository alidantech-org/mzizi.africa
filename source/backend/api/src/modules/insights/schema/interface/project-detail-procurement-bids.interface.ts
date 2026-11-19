import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Project Detail Procurement Bids */
export interface ProjectDetailProcurementBids {
  amount: Number;
  bidder: String;
  outcome: String;
}
