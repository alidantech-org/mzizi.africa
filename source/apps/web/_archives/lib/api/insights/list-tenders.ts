import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type TenderInput,
  TenderInputFields,
} from "#/_archives/lib/types/tender-input";
import {
  type TenderList,
  TenderListFields,
} from "#/_archives/lib/types/tender-list";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listTendersInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: TenderInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listTendersOutputFields: readonly FieldMeta[] | undefined =
  TenderListFields;
/** This operation has no query plan, so no paging is known. */
export const listTendersPage: PageNames | undefined = undefined;

/** Values for each input port of List Tenders. */
export type ListTendersPorts = {
  input?: TenderInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listTendersRequest(ports: ListTendersPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Tenders and contracts: open, ongoing, closed, awarded and complete, with suppliers, plus transparency information.
 *
 * GET /v1/tenders. Used when no operation.client pack is bound.
 */
export async function listTenders(
  input: ClientInput = {},
): Promise<ClientResponse<TenderList>> {
  const path = "/v1/tenders";
  return send("GET", path, input);
}
