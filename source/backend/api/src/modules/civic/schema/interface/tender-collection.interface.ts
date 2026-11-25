import type { TenderEntry } from "#/modules/civic/schema/interface/tender-entry.interface.ts";

/** Tender Collection */
export interface TenderCollection {
  tenders: TenderEntry[];
}
