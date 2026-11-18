"use server";

/**
 * One facility with its capacity, the places it is in and the polling stations it hosts.
 *
 * GET /v1/facilities/{code}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExperienceFacilityDetail } from "#sdk/types/experience/facility-detail.ts";

export type GetFacilityInput = ActionInput<{ code: string }, { languageCode?: string }, never>;

export async function getFacility(input: GetFacilityInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = `/v1/facilities/${input.params.code}`;
  return api.get<ExperienceFacilityDetail>(path, options);
}
