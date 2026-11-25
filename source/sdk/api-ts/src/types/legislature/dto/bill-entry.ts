import type { LegislatureBillEntryNames } from "#sdk/types/legislature/dto/bill-entry-names.ts";

/** Bill Entry */
export interface LegislatureBillEntry {
  billId: string;
  code: string;
  instrumentId: string | null;
  kindTerm: string;
  names: LegislatureBillEntryNames[];
  statusTerm: string;
  termId: string | null;
}
