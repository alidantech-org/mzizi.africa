"use server";

/**
 * What places can be ranked by: statistics, finance, civic delivery, procurement and elections.
 *
 * GET /v1/leaderboards
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsLeaderboardMetricList } from "#sdk/types/insights/leaderboard-metric-list.ts";

export type ListLeaderboardMetricsInput = ActionInput<never, never, never>;

export async function listLeaderboardMetrics(input: ListLeaderboardMetricsInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/leaderboards";
  return api.get<InsightsLeaderboardMetricList>(path, options);
}
