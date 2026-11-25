import type { BillEntry } from "#/modules/legislature/schema/interface/bill-entry.interface.ts";

/** Bill Collection */
export interface BillCollection {
  bills: BillEntry[];
}
