"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { FinanceAppropriationCollection } from "#sdk/types/finance/dto/appropriation-collection.ts";
import type { FinanceBudgetCollection } from "#sdk/types/finance/dto/budget-collection.ts";
import type { FinanceFindingCollection } from "#sdk/types/finance/dto/finding-collection.ts";
import type { FinanceGovernmentBudgets } from "#sdk/types/finance/dto/government-budgets.ts";
import type { FinanceInstitutionFindings } from "#sdk/types/finance/dto/institution-findings.ts";
import type { FinanceRevisionLines } from "#sdk/types/finance/dto/revision-lines.ts";
/** GET /v1/finance/appropriations */
export type FinanceListAppropriationsActionInput = ActionInput<never, FinanceRevisionLines, never>;

export async function financeListAppropriations(input: FinanceListAppropriationsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.finance.listAppropriations;
  return api.get<FinanceAppropriationCollection>(path, options);
}
/** GET /v1/finance/budgets */
export type FinanceListBudgetsActionInput = ActionInput<never, FinanceGovernmentBudgets, never>;

export async function financeListBudgets(input: FinanceListBudgetsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.finance.listBudgets;
  return api.get<FinanceBudgetCollection>(path, options);
}
/** GET /v1/finance/findings */
export type FinanceListFindingsActionInput = ActionInput<never, FinanceInstitutionFindings, never>;

export async function financeListFindings(input: FinanceListFindingsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.finance.listFindings;
  return api.get<FinanceFindingCollection>(path, options);
}
