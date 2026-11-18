"use server";

/**
 * Elections in a place over time: who won, with what votes, turnout and the registration trend.
 *
 * GET /v1/elections/places/{featureId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsPlaceElections } from "#sdk/types/insights/place-elections.ts";

export type GetPlaceElectionsInput = ActionInput<{ featureId: string }, never, never>;

export async function getPlaceElections(input: GetPlaceElectionsInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/elections/places/${input.params.featureId}`;
  return api.get<InsightsPlaceElections>(path, options);
}
