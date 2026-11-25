"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { GovernanceGovernanceIdentityScope } from "#sdk/types/governance/dto/governance-identity-scope.ts";
import type { GovernanceInstitutionCollection } from "#sdk/types/governance/dto/institution-collection.ts";
import type { GovernanceInstitutionDetail } from "#sdk/types/governance/dto/institution-detail.ts";
import type { GovernanceInstitutionWindow } from "#sdk/types/governance/dto/institution-window.ts";
import type { GovernanceOfficeCollection } from "#sdk/types/governance/dto/office-collection.ts";
import type { GovernanceOfficeDetail } from "#sdk/types/governance/dto/office-detail.ts";
import type { GovernancePlaceOffices } from "#sdk/types/governance/dto/place-offices.ts";
import type { GovernancePowerCollection } from "#sdk/types/governance/dto/power-collection.ts";
import type { GovernanceRelationshipCollection } from "#sdk/types/governance/dto/relationship-collection.ts";
/** GET /v1/governance/institutions/{code} */
export type GovernanceGetInstitutionActionInput = ActionInput<{ code: string }, never, never>;

export async function governanceGetInstitution(input: GovernanceGetInstitutionActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.governance.getInstitution(input.params);
  return api.get<GovernanceInstitutionDetail>(path, options);
}
/** GET /v1/governance/offices/{code} */
export type GovernanceGetOfficeActionInput = ActionInput<{ code: string }, never, never>;

export async function governanceGetOffice(input: GovernanceGetOfficeActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.governance.getOffice(input.params);
  return api.get<GovernanceOfficeDetail>(path, options);
}
/** GET /v1/governance/institutions */
export type GovernanceListInstitutionsActionInput = ActionInput<
  never,
  GovernanceInstitutionWindow,
  never
>;

export async function governanceListInstitutions(input: GovernanceListInstitutionsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.governance.listInstitutions;
  return api.get<GovernanceInstitutionCollection>(path, options);
}
/** GET /v1/governance/members */
export type GovernanceListMembersActionInput = ActionInput<
  never,
  GovernanceGovernanceIdentityScope,
  never
>;

export async function governanceListMembers(input: GovernanceListMembersActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.governance.listMembers;
  return api.get<GovernanceRelationshipCollection>(path, options);
}
/** GET /v1/governance/offices */
export type GovernanceListPlaceOfficesActionInput = ActionInput<
  never,
  GovernancePlaceOffices,
  never
>;

export async function governanceListPlaceOffices(input: GovernanceListPlaceOfficesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.governance.listPlaceOffices;
  return api.get<GovernanceOfficeCollection>(path, options);
}
/** GET /v1/governance/powers */
export type GovernanceListPowersActionInput = ActionInput<
  never,
  GovernanceGovernanceIdentityScope,
  never
>;

export async function governanceListPowers(input: GovernanceListPowersActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.governance.listPowers;
  return api.get<GovernancePowerCollection>(path, options);
}
