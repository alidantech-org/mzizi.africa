import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type ElectionList,
  ElectionListFields,
} from "#/_archives/lib/types/election-list";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listElectionsInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {};
/** Field metadata of the output, when it is a schema. */
export const listElectionsOutputFields: readonly FieldMeta[] | undefined =
  ElectionListFields;
/** This operation has no query plan, so no paging is known. */
export const listElectionsPage: PageNames | undefined = undefined;

/** Values for each input port of List Elections. */
export type ListElectionsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listElectionsRequest(
  ports: ListElectionsPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * Every election the system knows, newest first.
 *
 * GET /v1/elections. Used when no operation.client pack is bound.
 */
export async function listElections(
  input: ClientInput = {},
): Promise<ClientResponse<ElectionList>> {
  const path = "/v1/elections";
  return send("GET", path, input);
}
