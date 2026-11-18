"use server";

/**
 * Record a review decision. Approval queues promotion through the change ledger; nothing is written to domain tables here.
 *
 * POST /v1/candidates/{candidateId}/decision
 */
import type { ApiBridgeResponse } from "next-api-bridge";
import { redirect } from "next/navigation";

import {
  api,
  type ActionInput,
  actionFormDataValue,
  cleanActionFormData,
  formActionRedirectPath,
  type FormActionResult,
  requestOptions,
} from "#sdk/helpers/index.ts";
import type { StagingCandidate } from "#sdk/types/staging/candidate.ts";
import type { StagingDecisionBody } from "#sdk/types/staging/decision-body.ts";

export type DecideCandidateInput = ActionInput<{ candidateId: string }, never, StagingDecisionBody>;

export async function decideCandidate(input: DecideCandidateInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/candidates/${input.params.candidateId}/decision`;
  return api.post<StagingCandidate>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for decideCandidate. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function decideCandidateAction(
  _previous: FormActionResult<StagingDecisionBody, ApiBridgeResponse<StagingCandidate>> | null,
  data: FormData,
): Promise<FormActionResult<StagingDecisionBody, ApiBridgeResponse<StagingCandidate>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<StagingDecisionBody>(data);
  const response = await decideCandidate({
    params: {
      candidateId: actionFormDataValue(data, "__path:candidateId"),
    },
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
