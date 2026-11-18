"use server";

/**
 * The same place document for a known feature, for visitors who pick a place by name instead of position.
 *
 * GET /v1/locality/{featureId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LocalityLocalityProfile } from "#sdk/types/locality/locality-profile.ts";

export type GetLocalityInput = ActionInput<{ featureId: string }, { languageCode?: string }, never>;

export async function getLocality(input: GetLocalityInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = `/v1/locality/${input.params.featureId}`;
  return api.get<LocalityLocalityProfile>(path, options);
}
