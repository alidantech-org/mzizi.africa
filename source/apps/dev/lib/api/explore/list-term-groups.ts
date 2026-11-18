import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type TermGroupList, TermGroupListFields } from "#/lib/types/term-group-list.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listTermGroupsInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {};
/** Field metadata of the output, when it is a schema. */
export const listTermGroupsOutputFields: readonly FieldMeta[] | undefined = TermGroupListFields;
/** This operation has no query plan, so no paging is known. */
export const listTermGroupsPage: PageNames | undefined = undefined;

/** Values for each input port of List Term Groups. */
export type ListTermGroupsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listTermGroupsRequest(ports: ListTermGroupsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * Every term group, with its canonical terms.
 *
 * GET /v1/explore/terms. Used when no operation.client pack is bound.
 */
export async function listTermGroups(
  input: ClientInput = {},
): Promise<ClientResponse<TermGroupList>> {
  const path = "/v1/explore/terms";
  return send("GET", path, input);
}
