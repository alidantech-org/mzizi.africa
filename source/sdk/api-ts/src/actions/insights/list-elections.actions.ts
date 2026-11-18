"use server";

/**
 * Every election the system knows, newest first.
 *
 * GET /v1/elections
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsElectionList } from "#sdk/types/insights/election-list.ts";

export type ListElectionsInput = ActionInput<never, never, never>;

export async function listElections(input: ListElectionsInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/elections";
  return api.get<InsightsElectionList>(path, options);
}
