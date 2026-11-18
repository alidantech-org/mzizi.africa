"use server";

/**
 * Who and where the visitor is: the country and how it was decided, the language, the place resolved from the clean address path, the levels of the country's ladder and the countries that can be chosen.
 *
 * GET /v1/context
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExperienceContext } from "#sdk/types/experience/context.ts";

export type GetContextInput = ActionInput<
  never,
  { countryCode?: string; languageCode?: string; path?: string; featureId?: string },
  never
>;

export async function getContext(input: GetContextInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/context";
  return api.get<ExperienceContext>(path, options);
}
