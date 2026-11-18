"use server";

/**
 * Cancel a queued or running job.
 *
 * POST /v1/jobs/{jobId}/cancel
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { EngineJob } from "#sdk/types/engine/job.ts";

export type CancelJobInput = ActionInput<{ jobId: string }, never, never>;

export async function cancelJob(input: CancelJobInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/jobs/${input.params.jobId}/cancel`;
  return api.post<EngineJob>(path, undefined, options);
}
