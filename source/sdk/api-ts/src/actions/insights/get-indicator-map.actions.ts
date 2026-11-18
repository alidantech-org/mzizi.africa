"use server";

/**
 * One indicator's latest value for each unit under a parent, for a heat map.
 *
 * GET /v1/statistics/indicators/{indicatorCode}/map
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsIndicatorMap } from "#sdk/types/insights/indicator-map.ts";

export type GetIndicatorMapInput = ActionInput<
  { indicatorCode: string },
  { parentFeatureId?: string; kindCode?: string },
  never
>;

export async function getIndicatorMap(input: GetIndicatorMapInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = `/v1/statistics/indicators/${input.params.indicatorCode}/map`;
  return api.get<InsightsIndicatorMap>(path, options);
}
