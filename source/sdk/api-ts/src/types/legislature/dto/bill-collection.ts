import type { LegislatureBillEntry } from "#sdk/types/legislature/dto/bill-entry.ts";

/** Bill Collection */
export interface LegislatureBillCollection {
  bills: LegislatureBillEntry[];
}
