"use server";

/**
 * The data sources behind the platform, with their publisher and how many artifacts and citations each has.
 *
 * GET /v1/sources
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LocalitySourceCollection } from "#sdk/types/locality/source-collection.ts";
import type { LocalitySourceSearchInput } from "#sdk/types/locality/source-search-input.ts";

export type BrowseSourcesInput = ActionInput<never, LocalitySourceSearchInput, never>;

export async function browseSources(input: BrowseSourcesInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/sources";
  return api.get<LocalitySourceCollection>(path, options);
}
