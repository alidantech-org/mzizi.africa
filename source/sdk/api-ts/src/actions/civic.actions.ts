"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { CivicCountryFacilities } from "#sdk/types/civic/dto/country-facilities.ts";
import type { CivicCountryTenders } from "#sdk/types/civic/dto/country-tenders.ts";
import type { CivicFacilityCollection } from "#sdk/types/civic/dto/facility-collection.ts";
import type { CivicPlaceProjects } from "#sdk/types/civic/dto/place-projects.ts";
import type { CivicProjectCollection } from "#sdk/types/civic/dto/project-collection.ts";
import type { CivicProjectDetail } from "#sdk/types/civic/dto/project-detail.ts";
import type { CivicTenderCollection } from "#sdk/types/civic/dto/tender-collection.ts";
import type { CivicTenderDetail } from "#sdk/types/civic/dto/tender-detail.ts";
/** GET /v1/civic/projects/{code} */
export type CivicGetProjectActionInput = ActionInput<{ code: string }, never, never>;

export async function civicGetProject(input: CivicGetProjectActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.civic.getProject(input.params);
  return api.get<CivicProjectDetail>(path, options);
}
/** GET /v1/civic/tenders/{code} */
export type CivicGetTenderActionInput = ActionInput<{ code: string }, never, never>;

export async function civicGetTender(input: CivicGetTenderActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.civic.getTender(input.params);
  return api.get<CivicTenderDetail>(path, options);
}
/** GET /v1/civic/facilities */
export type CivicListFacilitiesActionInput = ActionInput<never, CivicCountryFacilities, never>;

export async function civicListFacilities(input: CivicListFacilitiesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.civic.listFacilities;
  return api.get<CivicFacilityCollection>(path, options);
}
/** GET /v1/civic/projects */
export type CivicListPlaceProjectsActionInput = ActionInput<never, CivicPlaceProjects, never>;

export async function civicListPlaceProjects(input: CivicListPlaceProjectsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.civic.listPlaceProjects;
  return api.get<CivicProjectCollection>(path, options);
}
/** GET /v1/civic/tenders */
export type CivicListTendersActionInput = ActionInput<never, CivicCountryTenders, never>;

export async function civicListTenders(input: CivicListTendersActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.civic.listTenders;
  return api.get<CivicTenderCollection>(path, options);
}
