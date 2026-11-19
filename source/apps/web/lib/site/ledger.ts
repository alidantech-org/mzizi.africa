/** Reads of the ledger lists (budgets, funds, coverage, coalitions, manifestos) through the generated server actions. */
import { getCoverage } from "@mzizi/api-client/actions/ledger/get-coverage.actions.ts";
import { listBudgets } from "@mzizi/api-client/actions/ledger/list-budgets.actions.ts";
import { listCoalitions } from "@mzizi/api-client/actions/ledger/list-coalitions.actions.ts";
import { listFunds } from "@mzizi/api-client/actions/ledger/list-funds.actions.ts";
import { listManifestos } from "@mzizi/api-client/actions/ledger/list-manifestos.actions.ts";

async function body<T>(pending: Promise<{ success: boolean; body: T | null; message?: string }>): Promise<T> {
  const result = await pending;
  if (!result.success || result.body === null) throw new Error(result.message || "This information could not be loaded.");
  return result.body;
}

export const budgets = () => body(listBudgets({ query: { limit: 200 } }));
export const funds = (limit = 200) => body(listFunds({ query: { limit } }));
export const coverage = () => body(getCoverage({}));
export const coalitions = () => body(listCoalitions({}));
export const manifestos = () => body(listManifestos({}));
