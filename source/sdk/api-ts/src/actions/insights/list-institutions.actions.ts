"use server";

/**
 * Every public body grouped by arm of government and kind, with what created it and how many leaders it has. The groups and labels come from the reference schemes.
 *
 * GET /v1/institutions
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsInstitutionList } from "#sdk/types/insights/institution-list.ts";
import type { InsightsInstitutionsInput } from "#sdk/types/insights/institutions-input.ts";

export type ListInstitutionsInput = ActionInput<never, InsightsInstitutionsInput, never>;

export async function listInstitutions(input: ListInstitutionsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/institutions";
  return api.get<InsightsInstitutionList>(path, options);
}
