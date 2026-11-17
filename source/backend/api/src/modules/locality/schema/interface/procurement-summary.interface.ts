import type { Amount } from "#/modules/locality/schema/type/amount.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { ProcurementItem } from "#/modules/locality/schema/interface/procurement-item.interface.ts";

/** Procurement Summary */
export interface ProcurementSummary {
  count: NonNegativeInteger;
  currency?: NonEmptyString100 | null;
  recent: ProcurementItem[];
  totalAmount?: Amount | null;
}
