"use server";

/**
 * Candidates awaiting or past review, optionally by kind or status.
 *
 * GET /v1/candidates
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { StagingCandidateList } from "#sdk/types/staging/candidate-list.ts";

export type ListCandidatesInput = ActionInput<
  never,
  { kind?: string; status?: string; limit?: number },
  never
>;

export async function listCandidates(input: ListCandidatesInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/candidates";
  return api.get<StagingCandidateList>(path, options);
}
