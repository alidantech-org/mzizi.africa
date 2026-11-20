import type { LedgerFund } from "#sdk/types/ledger/dto/fund.ts";

/** Fund List */
export interface LedgerFundList {
  funds: LedgerFund[];
  gaps: string[];
  total: number;
}
