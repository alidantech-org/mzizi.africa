"use server";

/**
 * Places whose name matches the text, in any language, narrowest units first.
 *
 * GET /v1/locality/search
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LocalityLocalityMatches } from "#sdk/types/locality/locality-matches.ts";
import type { LocalitySearchInput } from "#sdk/types/locality/search-input.ts";

export type SearchLocalitiesInput = ActionInput<never, LocalitySearchInput, never>;

export async function searchLocalities(input: SearchLocalitiesInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/locality/search";
  return api.get<LocalityLocalityMatches>(path, options);
}
