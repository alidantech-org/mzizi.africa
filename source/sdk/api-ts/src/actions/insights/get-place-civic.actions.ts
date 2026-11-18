"use server";

/**
 * Civic delivery in a place: fund allocations and spending by class and year, projects with locations, infrastructure and leadership.
 *
 * GET /v1/civic/places/{featureId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsPlaceCivic } from "#sdk/types/insights/place-civic.ts";

export type GetPlaceCivicInput = ActionInput<{ featureId: string }, never, never>;

export async function getPlaceCivic(input: GetPlaceCivicInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/civic/places/${input.params.featureId}`;
  return api.get<InsightsPlaceCivic>(path, options);
}
