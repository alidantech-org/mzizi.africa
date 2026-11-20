"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { LedgerBudgetList } from "#sdk/types/ledger/dto/budget-list.ts";
import type { LedgerCoalitionList } from "#sdk/types/ledger/dto/coalition-list.ts";
import type { LedgerCoverageList } from "#sdk/types/ledger/dto/coverage-list.ts";
import type { LedgerFundList } from "#sdk/types/ledger/dto/fund-list.ts";
import type { LedgerLedgerInput } from "#sdk/types/ledger/dto/ledger-input.ts";
import type { LedgerManifestoList } from "#sdk/types/ledger/dto/manifesto-list.ts";
/** GET /v1/coverage */
export type LedgerGetCoverageActionInput = ActionInput<never, never, never>;

export async function ledgerGetCoverage(input: LedgerGetCoverageActionInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.ledger.getCoverage;
  return api.get<LedgerCoverageList>(path, options);
}
/** GET /v1/budgets */
export type LedgerListBudgetsActionInput = ActionInput<never, LedgerLedgerInput, never>;

export async function ledgerListBudgets(input: LedgerListBudgetsActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.ledger.listBudgets;
  return api.get<LedgerBudgetList>(path, options);
}
/** GET /v1/coalitions */
export type LedgerListCoalitionsActionInput = ActionInput<never, never, never>;

export async function ledgerListCoalitions(input: LedgerListCoalitionsActionInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.ledger.listCoalitions;
  return api.get<LedgerCoalitionList>(path, options);
}
/** GET /v1/funds */
export type LedgerListFundsActionInput = ActionInput<never, LedgerLedgerInput, never>;

export async function ledgerListFunds(input: LedgerListFundsActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.ledger.listFunds;
  return api.get<LedgerFundList>(path, options);
}
/** GET /v1/manifestos */
export type LedgerListManifestosActionInput = ActionInput<never, never, never>;

export async function ledgerListManifestos(input: LedgerListManifestosActionInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.ledger.listManifestos;
  return api.get<LedgerManifestoList>(path, options);
}
