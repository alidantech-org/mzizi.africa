import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type BudgetList,
  BudgetListFields,
} from "#/_archives/lib/types/budget-list";
import {
  type LedgerInput,
  LedgerInputFields,
} from "#/_archives/lib/types/ledger-input";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listBudgetsInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: LedgerInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listBudgetsOutputFields: readonly FieldMeta[] | undefined =
  BudgetListFields;
/** This operation has no query plan, so no paging is known. */
export const listBudgetsPage: PageNames | undefined = undefined;

/** Values for each input port of List Budgets. */
export type ListBudgetsPorts = {
  input?: LedgerInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listBudgetsRequest(ports: ListBudgetsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Budgets by fiscal year with their revisions, newest first.
 *
 * GET /v1/budgets. Used when no operation.client pack is bound.
 */
export async function listBudgets(
  input: ClientInput = {},
): Promise<ClientResponse<BudgetList>> {
  const path = "/v1/budgets";
  return send("GET", path, input);
}
