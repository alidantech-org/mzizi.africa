"use server";

/**
 * Page through public institutions with their names, optionally by code prefix.
 *
 * GET /v1/governance/institutions
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { GovernanceInstitutionCollection } from "#sdk/types/governance/institution-collection.ts";
import type { GovernanceInstitutionWindow } from "#sdk/types/governance/institution-window.ts";

export type BrowseInstitutionsInput = ActionInput<never, GovernanceInstitutionWindow, never>;

export async function browseInstitutions(input: BrowseInstitutionsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/governance/institutions";
  return api.get<GovernanceInstitutionCollection>(path, options);
}
