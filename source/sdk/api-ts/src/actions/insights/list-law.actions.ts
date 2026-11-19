"use server";

/**
 * Legal instruments held, highest authority first (constitution, then acts, then regulations), with their size.
 *
 * GET /v1/law
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsLawInput } from "#sdk/types/insights/law-input.ts";
import type { InsightsLawList } from "#sdk/types/insights/law-list.ts";

export type ListLawInput = ActionInput<never, InsightsLawInput, never>;

export async function listLaw(input: ListLawInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/law";
  return api.get<InsightsLawList>(path, options);
}
