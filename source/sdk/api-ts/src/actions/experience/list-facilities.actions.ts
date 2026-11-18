"use server";

/**
 * Civic infrastructure and offices by class and place: schools, hospitals, police stations, county and constituency offices, polling stations, with capacity and coordinates.
 *
 * GET /v1/facilities
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExperienceFacilitiesInput } from "#sdk/types/experience/facilities-input.ts";
import type { ExperienceFacilityList } from "#sdk/types/experience/facility-list.ts";

export type ListFacilitiesInput = ActionInput<never, ExperienceFacilitiesInput, never>;

export async function listFacilities(input: ListFacilitiesInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/facilities";
  return api.get<ExperienceFacilityList>(path, options);
}
