"use server";

/**
 * Places worth comparing a place with: the ten closest by geography, the ten top performers, and the ladder of the units above it, saying plainly which rungs do not exist.
 *
 * GET /v1/compare/options
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsCompareOptionsInput } from "#sdk/types/insights/compare-options-input.ts";
import type { InsightsCompareOptions } from "#sdk/types/insights/compare-options.ts";

export type GetCompareOptionsInput = ActionInput<never, InsightsCompareOptionsInput, never>;

export async function getCompareOptions(input: GetCompareOptionsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/compare/options";
  return api.get<InsightsCompareOptions>(path, options);
}
