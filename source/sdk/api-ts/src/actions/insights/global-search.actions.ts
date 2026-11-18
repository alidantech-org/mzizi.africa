"use server";

/**
 * One search over places, leaders, parties, projects, tenders, indicators, sources and laws; every hit says what it is.
 *
 * GET /v1/search
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsSearchQuery } from "#sdk/types/insights/search-query.ts";
import type { InsightsSearchResults } from "#sdk/types/insights/search-results.ts";

export type GlobalSearchInput = ActionInput<never, InsightsSearchQuery, never>;

export async function globalSearch(input: GlobalSearchInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/search";
  return api.get<InsightsSearchResults>(path, options);
}
