"use server";

/**
 * What the platform expects to be published and what has been checked: the honest map of what is missing.
 *
 * GET /v1/coverage
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LedgerCoverageList } from "#sdk/types/ledger/coverage-list.ts";

export type GetCoverageInput = ActionInput<never, never, never>;

export async function getCoverage(input: GetCoverageInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/coverage";
  return api.get<LedgerCoverageList>(path, options);
}
