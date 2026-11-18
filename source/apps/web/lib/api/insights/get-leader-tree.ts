import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type LeaderTree, LeaderTreeFields } from "#/lib/types/leader-tree.ts";
import { type TreeInput, TreeInputFields } from "#/lib/types/tree-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getLeaderTreeInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: TreeInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getLeaderTreeOutputFields: readonly FieldMeta[] | undefined = LeaderTreeFields;
/** This operation has no query plan, so no paging is known. */
export const getLeaderTreePage: PageNames | undefined = undefined;

/** Values for each input port of Get Leader Tree. */
export type GetLeaderTreePorts = {
  input?: TreeInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getLeaderTreeRequest(ports: GetLeaderTreePorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * The leaders above and at a place, as a family tree: national first, then county, constituency and ward, split into elected, appointed and nominated.
 *
 * GET /v1/leaders/tree. Used when no operation.client pack is bound.
 */
export async function getLeaderTree(input: ClientInput = {}): Promise<ClientResponse<LeaderTree>> {
  const path = "/v1/leaders/tree";
  return send("GET", path, input);
}
