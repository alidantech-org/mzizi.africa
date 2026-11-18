"use server";

/**
 * Political parties ranked by members, votes and fund allocation.
 *
 * GET /v1/parties
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsPartyList } from "#sdk/types/insights/party-list.ts";

export type ListPartiesInput = ActionInput<never, never, never>;

export async function listParties(input: ListPartiesInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/parties";
  return api.get<InsightsPartyList>(path, options);
}
