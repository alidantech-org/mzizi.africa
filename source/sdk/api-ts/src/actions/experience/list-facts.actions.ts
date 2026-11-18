"use server";

/**
 * Fun facts for the country and, with a place, for it and the places above it.
 *
 * GET /v1/facts
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExperienceFactList } from "#sdk/types/experience/fact-list.ts";
import type { ExperienceFactsInput } from "#sdk/types/experience/facts-input.ts";

export type ListFactsInput = ActionInput<never, ExperienceFactsInput, never>;

export async function listFacts(input: ListFactsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/facts";
  return api.get<ExperienceFactList>(path, options);
}
