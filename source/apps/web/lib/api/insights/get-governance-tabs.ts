import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type GovernanceTabs, GovernanceTabsFields } from "#/lib/types/governance-tabs.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getGovernanceTabsInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {};
/** Field metadata of the output, when it is a schema. */
export const getGovernanceTabsOutputFields: readonly FieldMeta[] | undefined = GovernanceTabsFields;
/** This operation has no query plan, so no paging is known. */
export const getGovernanceTabsPage: PageNames | undefined = undefined;

/** Values for each input port of Get Governance Tabs. */
export type GetGovernanceTabsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getGovernanceTabsRequest(ports: GetGovernanceTabsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * The ways to look at leaders (elected, nominated, appointed) and the bodies to switch to, all read from the reference schemes.
 *
 * GET /v1/governance/tabs. Used when no operation.client pack is bound.
 */
export async function getGovernanceTabs(
  input: ClientInput = {},
): Promise<ClientResponse<GovernanceTabs>> {
  const path = "/v1/governance/tabs";
  return send("GET", path, input);
}
