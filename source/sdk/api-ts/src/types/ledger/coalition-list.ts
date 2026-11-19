import type { LedgerCoalition } from "#sdk/types/ledger/coalition.ts";

/** Coalition List */
export interface LedgerCoalitionList {
  coalitions: LedgerCoalition[];
  gaps: string[];
}
