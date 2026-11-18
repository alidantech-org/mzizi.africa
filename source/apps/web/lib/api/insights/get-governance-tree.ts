import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type GovTreeInput, GovTreeInputFields } from "#/lib/types/gov-tree-input.ts";
import { type GovernanceTree, GovernanceTreeFields } from "#/lib/types/governance-tree.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getGovernanceTreeInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: GovTreeInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getGovernanceTreeOutputFields: readonly FieldMeta[] | undefined = GovernanceTreeFields;
/** This operation has no query plan, so no paging is known. */
export const getGovernanceTreePage: PageNames | undefined = undefined;

/** Values for each input port of Get Governance Tree. */
export type GetGovernanceTreePorts = {
  input?: GovTreeInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getGovernanceTreeRequest(ports: GetGovernanceTreePorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * A tree of leaders for one tab or one body: nodes with their tier, how they got the seat, a performance bar and the reference codes behind them; edges from superior to deputy or body to member; and a side rail of the levels of government.
 *
 * GET /v1/governance/tree. Used when no operation.client pack is bound.
 */
export async function getGovernanceTree(
  input: ClientInput = {},
): Promise<ClientResponse<GovernanceTree>> {
  const path = "/v1/governance/tree";
  return send("GET", path, input);
}
