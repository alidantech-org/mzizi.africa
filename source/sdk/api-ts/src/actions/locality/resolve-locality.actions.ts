"use server";

/**
 * Who and what serves the place at a position: the containing units, the office holders scoped to them, procurement there, media and the evidence for each claim, in the requested language.
 *
 * GET /v1/locality/at
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LocalityLocalityProfile } from "#sdk/types/locality/locality-profile.ts";
import type { LocalityPositionInput } from "#sdk/types/locality/position-input.ts";

export type ResolveLocalityInput = ActionInput<never, LocalityPositionInput, never>;

export async function resolveLocality(input: ResolveLocalityInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/locality/at";
  return api.get<LocalityLocalityProfile>(path, options);
}
