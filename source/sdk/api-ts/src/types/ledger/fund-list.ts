import type { LedgerFund } from "#sdk/types/ledger/fund.ts";

/** Fund List */
export interface LedgerFundList {
  funds: LedgerFund[];
  gaps: string[];
  total: number;
}
