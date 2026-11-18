"use server";

/**
 * One indicator over time for one place, optionally broken down.
 *
 * GET /v1/statistics/indicators/{indicatorCode}/series
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsIndicatorSeries } from "#sdk/types/insights/indicator-series.ts";

export type GetIndicatorSeriesInput = ActionInput<
  { indicatorCode: string },
  { featureId?: string },
  never
>;

export async function getIndicatorSeries(input: GetIndicatorSeriesInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = `/v1/statistics/indicators/${input.params.indicatorCode}/series`;
  return api.get<InsightsIndicatorSeries>(path, options);
}
