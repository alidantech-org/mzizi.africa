"use server";

/**
 * Places (or leaders, parties) ranked by one metric, within a parent area and a level.
 *
 * GET /v1/leaderboards/{metricCode}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsLeaderboard } from "#sdk/types/insights/leaderboard.ts";

export type GetLeaderboardInput = ActionInput<
  { metricCode: string },
  { kindCode?: string; parentFeatureId?: string; limit?: number },
  never
>;

export async function getLeaderboard(input: GetLeaderboardInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = `/v1/leaderboards/${input.params.metricCode}`;
  return api.get<InsightsLeaderboard>(path, options);
}
