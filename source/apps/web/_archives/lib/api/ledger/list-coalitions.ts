import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type CoalitionList,
  CoalitionListFields,
} from "#/_archives/lib/types/coalition-list";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listCoalitionsInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {};
/** Field metadata of the output, when it is a schema. */
export const listCoalitionsOutputFields: readonly FieldMeta[] | undefined =
  CoalitionListFields;
/** This operation has no query plan, so no paging is known. */
export const listCoalitionsPage: PageNames | undefined = undefined;

/** Values for each input port of List Coalitions. */
export type ListCoalitionsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listCoalitionsRequest(
  ports: ListCoalitionsPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * Coalitions of parties.
 *
 * GET /v1/coalitions. Used when no operation.client pack is bound.
 */
export async function listCoalitions(
  input: ClientInput = {},
): Promise<ClientResponse<CoalitionList>> {
  const path = "/v1/coalitions";
  return send("GET", path, input);
}
