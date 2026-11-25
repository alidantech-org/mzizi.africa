import type { CivicTenderEntry } from "#sdk/types/civic/dto/tender-entry.ts";

/** Tender Collection */
export interface CivicTenderCollection {
  tenders: CivicTenderEntry[];
}
