"use server";

/**
 * Coalitions of parties.
 *
 * GET /v1/coalitions
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LedgerCoalitionList } from "#sdk/types/ledger/coalition-list.ts";

export type ListCoalitionsInput = ActionInput<never, never, never>;

export async function listCoalitions(input: ListCoalitionsInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/coalitions";
  return api.get<LedgerCoalitionList>(path, options);
}
