"use server";

/**
 * One candidate with its payload, confidence and the captures it came from.
 *
 * GET /v1/candidates/{candidateId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { StagingCandidate } from "#sdk/types/staging/candidate.ts";

export type GetCandidateInput = ActionInput<{ candidateId: string }, never, never>;

export async function getCandidate(input: GetCandidateInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/candidates/${input.params.candidateId}`;
  return api.get<StagingCandidate>(path, options);
}
