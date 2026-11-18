"use server";

/**
 * Did-you-know facts about the country, and those tagged to a place and the places above it.
 *
 * GET /v1/facts
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsFactList } from "#sdk/types/insights/fact-list.ts";
import type { InsightsFactsInput } from "#sdk/types/insights/facts-input.ts";

export type ListFactsInput = ActionInput<never, InsightsFactsInput, never>;

export async function listFacts(input: ListFactsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/facts";
  return api.get<InsightsFactList>(path, options);
}
