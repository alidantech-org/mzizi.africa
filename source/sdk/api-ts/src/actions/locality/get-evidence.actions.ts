"use server";

/**
 * One citation with its source, edition, quoted text and the files it points at.
 *
 * GET /v1/evidence/{citationId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LocalityEvidenceDetail } from "#sdk/types/locality/evidence-detail.ts";

export type GetEvidenceInput = ActionInput<{ citationId: string }, never, never>;

export async function getEvidence(input: GetEvidenceInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/evidence/${input.params.citationId}`;
  return api.get<LocalityEvidenceDetail>(path, options);
}
