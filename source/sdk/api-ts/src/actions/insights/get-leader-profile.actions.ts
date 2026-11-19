"use server";

/**
 * A leader, by the person's slug: offices, contacts, media, voting and attendance record, the fund they oversee and evidence.
 *
 * GET /v1/leaders/{code}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsLeaderProfile } from "#sdk/types/insights/leader-profile.ts";

export type GetLeaderProfileInput = ActionInput<{ code: string }, never, never>;

export async function getLeaderProfile(input: GetLeaderProfileInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/leaders/${input.params.code}`;
  return api.get<InsightsLeaderProfile>(path, options);
}
