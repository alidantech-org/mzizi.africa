"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { GovernanceInstitutionCollection } from "#sdk/types/governance/dto/institution-collection.ts";
import type { GovernanceInstitutionDetail } from "#sdk/types/governance/dto/institution-detail.ts";
import type { GovernanceInstitutionWindow } from "#sdk/types/governance/dto/institution-window.ts";
import type { GovernanceOfficeDetail } from "#sdk/types/governance/dto/office-detail.ts";
/** GET /v1/governance/institutions */
export type GovernanceBrowseInstitutionsActionInput = ActionInput<
  never,
  GovernanceInstitutionWindow,
  never
>;

export async function governanceBrowseInstitutions(
  input: GovernanceBrowseInstitutionsActionInput = {},
) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.governance.browseInstitutions;
  return api.get<GovernanceInstitutionCollection>(path, options);
}
/** GET /v1/governance/institutions/{institutionId} */
export type GovernanceGetInstitutionActionInput = ActionInput<
  { institutionId: string },
  never,
  never
>;

export async function governanceGetInstitution(input: GovernanceGetInstitutionActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.governance.getInstitution(input.params);
  return api.get<GovernanceInstitutionDetail>(path, options);
}
/** GET /v1/governance/offices/{officeId} */
export type GovernanceGetOfficeActionInput = ActionInput<{ officeId: string }, never, never>;

export async function governanceGetOffice(input: GovernanceGetOfficeActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.governance.getOffice(input.params);
  return api.get<GovernanceOfficeDetail>(path, options);
}
