import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type DataListList, DataListListFields } from "#/lib/types/data-list-list.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listDataListsInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {};
/** Field metadata of the output, when it is a schema. */
export const listDataListsOutputFields: readonly FieldMeta[] | undefined = DataListListFields;
/** This operation has no query plan, so no paging is known. */
export const listDataListsPage: PageNames | undefined = undefined;

/** Values for each input port of List Data Lists. */
export type ListDataListsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listDataListsRequest(ports: ListDataListsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * The curated data lists, grouped by domain.
 *
 * GET /v1/explore/db/lists. Used when no operation.client pack is bound.
 */
export async function listDataLists(
  input: ClientInput = {},
): Promise<ClientResponse<DataListList>> {
  const path = "/v1/explore/db/lists";
  return send("GET", path, input);
}
