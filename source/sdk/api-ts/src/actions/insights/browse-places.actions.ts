"use server";

/**
 * The country's hierarchy one level at a time (county, constituency, ward, town, village), with the path to the current unit.
 *
 * GET /v1/browse
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsBrowseInput } from "#sdk/types/insights/browse-input.ts";
import type { InsightsPlaceBrowse } from "#sdk/types/insights/place-browse.ts";

export type BrowsePlacesInput = ActionInput<never, InsightsBrowseInput, never>;

export async function browsePlaces(input: BrowsePlacesInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/browse";
  return api.get<InsightsPlaceBrowse>(path, options);
}
