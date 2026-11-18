"use server";

/**
 * One party: members list, votes obtained by election and fund allocation.
 *
 * GET /v1/parties/{code}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsPartyDetail } from "#sdk/types/insights/party-detail.ts";

export type GetPartyInput = ActionInput<{ code: string }, never, never>;

export async function getParty(input: GetPartyInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/parties/${input.params.code}`;
  return api.get<InsightsPartyDetail>(path, options);
}
