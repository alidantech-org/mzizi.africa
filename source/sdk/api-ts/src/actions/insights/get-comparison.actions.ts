"use server";

/**
 * Two places on the same figures, aligned, with the difference in percent.
 *
 * GET /v1/compare
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsComparisonInput } from "#sdk/types/insights/comparison-input.ts";
import type { InsightsComparison } from "#sdk/types/insights/comparison.ts";

export type GetComparisonInput = ActionInput<never, InsightsComparisonInput, never>;

export async function getComparison(input: GetComparisonInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/compare";
  return api.get<InsightsComparison>(path, options);
}
