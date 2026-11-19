"use server";

/**
 * Party and candidate manifestos by election.
 *
 * GET /v1/manifestos
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LedgerManifestoList } from "#sdk/types/ledger/manifesto-list.ts";

export type ListManifestosInput = ActionInput<never, never, never>;

export async function listManifestos(input: ListManifestosInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/manifestos";
  return api.get<LedgerManifestoList>(path, options);
}
