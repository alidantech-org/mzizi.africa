"use server";

/**
 * Funds with who manages them, where they apply and how many money flows are recorded.
 *
 * GET /v1/funds
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LedgerFundList } from "#sdk/types/ledger/fund-list.ts";
import type { LedgerLedgerInput } from "#sdk/types/ledger/ledger-input.ts";

export type ListFundsInput = ActionInput<never, LedgerLedgerInput, never>;

export async function listFunds(input: ListFundsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/funds";
  return api.get<LedgerFundList>(path, options);
}
