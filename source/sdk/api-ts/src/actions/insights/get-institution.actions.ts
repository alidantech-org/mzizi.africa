"use server";

/**
 * One body: what it is for, what created it (with the Constitution articles or Acts), who leads it, the bodies it belongs to and oversees, and explanatory texts.
 *
 * GET /v1/institutions/{code}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsInstitutionDetail } from "#sdk/types/insights/institution-detail.ts";

export type GetInstitutionInput = ActionInput<{ code: string }, never, never>;

export async function getInstitution(input: GetInstitutionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/institutions/${input.params.code}`;
  return api.get<InsightsInstitutionDetail>(path, options);
}
