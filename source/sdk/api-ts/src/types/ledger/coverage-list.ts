import type { LedgerCoverageItem } from "#sdk/types/ledger/coverage-item.ts";

/** Coverage List */
export interface LedgerCoverageList {
  gaps: string[];
  items: LedgerCoverageItem[];
}
