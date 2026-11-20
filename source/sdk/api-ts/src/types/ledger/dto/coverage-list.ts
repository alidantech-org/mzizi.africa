import type { LedgerCoverageItem } from "#sdk/types/ledger/dto/coverage-item.ts";

/** Coverage List */
export interface LedgerCoverageList {
  gaps: string[];
  items: LedgerCoverageItem[];
}
