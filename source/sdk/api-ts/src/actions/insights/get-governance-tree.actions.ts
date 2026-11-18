"use server";

/**
 * A tree of leaders for one tab or one body: nodes with their tier, how they got the seat, a performance bar and the reference codes behind them; edges from superior to deputy or body to member; and a side rail of the levels of government.
 *
 * GET /v1/governance/tree
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsGovTreeInput } from "#sdk/types/insights/gov-tree-input.ts";
import type { InsightsGovernanceTree } from "#sdk/types/insights/governance-tree.ts";

export type GetGovernanceTreeInput = ActionInput<never, InsightsGovTreeInput, never>;

export async function getGovernanceTree(input: GetGovernanceTreeInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/governance/tree";
  return api.get<InsightsGovernanceTree>(path, options);
}
