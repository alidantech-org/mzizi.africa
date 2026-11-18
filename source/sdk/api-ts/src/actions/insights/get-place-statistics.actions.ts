"use server";

/**
 * Population and other statistics of a place, by topic, with history, breakdowns and comparison to its parents.
 *
 * GET /v1/statistics/places/{featureId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsPlaceStatistics } from "#sdk/types/insights/place-statistics.ts";

export type GetPlaceStatisticsInput = ActionInput<{ featureId: string }, never, never>;

export async function getPlaceStatistics(input: GetPlaceStatisticsInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/statistics/places/${input.params.featureId}`;
  return api.get<InsightsPlaceStatistics>(path, options);
}
