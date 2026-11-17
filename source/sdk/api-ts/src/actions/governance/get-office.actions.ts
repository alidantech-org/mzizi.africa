"use server";

/**
 * One office with everyone who has held it, newest first.
 *
 * GET /v1/governance/offices/{officeId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { GovernanceOfficeDetail } from "#sdk/types/governance/office-detail.ts";

export type GetOfficeInput = ActionInput<{ officeId: string }, never, never>;

export async function getOffice(input: GetOfficeInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/governance/offices/${input.params.officeId}`;
  return api.get<GovernanceOfficeDetail>(path, options);
}
