import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import { type FundList, FundListFields } from "#/_archives/lib/types/fund-list";
import {
  type LedgerInput,
  LedgerInputFields,
} from "#/_archives/lib/types/ledger-input";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listFundsInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: LedgerInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listFundsOutputFields: readonly FieldMeta[] | undefined =
  FundListFields;
/** This operation has no query plan, so no paging is known. */
export const listFundsPage: PageNames | undefined = undefined;

/** Values for each input port of List Funds. */
export type ListFundsPorts = {
  input?: LedgerInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listFundsRequest(ports: ListFundsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Funds with who manages them, where they apply and how many money flows are recorded.
 *
 * GET /v1/funds. Used when no operation.client pack is bound.
 */
export async function listFunds(
  input: ClientInput = {},
): Promise<ClientResponse<FundList>> {
  const path = "/v1/funds";
  return send("GET", path, input);
}
