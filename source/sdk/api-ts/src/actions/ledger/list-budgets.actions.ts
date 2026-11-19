"use server";

/**
 * Budgets by fiscal year with their revisions, newest first.
 *
 * GET /v1/budgets
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LedgerBudgetList } from "#sdk/types/ledger/budget-list.ts";
import type { LedgerLedgerInput } from "#sdk/types/ledger/ledger-input.ts";

export type ListBudgetsInput = ActionInput<never, LedgerLedgerInput, never>;

export async function listBudgets(input: ListBudgetsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/budgets";
  return api.get<LedgerBudgetList>(path, options);
}
