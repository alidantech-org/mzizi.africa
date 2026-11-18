"use server";

/**
 * Queue a job. Repeating an idempotency key returns the first job.
 *
 * POST /v1/jobs
 */
import type { ApiBridgeResponse } from "next-api-bridge";
import { redirect } from "next/navigation";

import {
  api,
  type ActionInput,
  cleanActionFormData,
  formActionRedirectPath,
  type FormActionResult,
  requestOptions,
} from "#sdk/helpers/index.ts";
import type { EngineJob } from "#sdk/types/engine/job.ts";
import type { EngineSubmitJobBody } from "#sdk/types/engine/submit-job-body.ts";

export type SubmitJobInput = ActionInput<never, never, EngineSubmitJobBody>;

export async function submitJob(input: SubmitJobInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/jobs";
  return api.post<EngineJob>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for submitJob. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function submitJobAction(
  _previous: FormActionResult<EngineSubmitJobBody, ApiBridgeResponse<EngineJob>> | null,
  data: FormData,
): Promise<FormActionResult<EngineSubmitJobBody, ApiBridgeResponse<EngineJob>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<EngineSubmitJobBody>(data);
  const response = await submitJob({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
