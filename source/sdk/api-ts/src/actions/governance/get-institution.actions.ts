"use server";

/**
 * One institution with its mandates and offices.
 *
 * GET /v1/governance/institutions/{institutionId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { GovernanceInstitutionDetail } from "#sdk/types/governance/institution-detail.ts";

export type GetInstitutionInput = ActionInput<{ institutionId: string }, never, never>;

export async function getInstitution(input: GetInstitutionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/governance/institutions/${input.params.institutionId}`;
  return api.get<GovernanceInstitutionDetail>(path, options);
}
