"use server";

/**
 * The leaders above and at a place, as a family tree: national first, then county, constituency and ward, split into elected, appointed and nominated.
 *
 * GET /v1/leaders/tree
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsLeaderTree } from "#sdk/types/insights/leader-tree.ts";
import type { InsightsTreeInput } from "#sdk/types/insights/tree-input.ts";

export type GetLeaderTreeInput = ActionInput<never, InsightsTreeInput, never>;

export async function getLeaderTree(input: GetLeaderTreeInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/leaders/tree";
  return api.get<InsightsLeaderTree>(path, options);
}
