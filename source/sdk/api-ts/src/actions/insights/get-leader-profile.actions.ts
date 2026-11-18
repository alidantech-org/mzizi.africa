"use server";

/**
 * A leader: offices, contacts, media, voting and attendance record, the fund they oversee and evidence.
 *
 * GET /v1/leaders/{id}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsLeaderProfile } from "#sdk/types/insights/leader-profile.ts";

export type GetLeaderProfileInput = ActionInput<{ id: string }, never, never>;

export async function getLeaderProfile(input: GetLeaderProfileInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/leaders/${input.params.id}`;
  return api.get<InsightsLeaderProfile>(path, options);
}
