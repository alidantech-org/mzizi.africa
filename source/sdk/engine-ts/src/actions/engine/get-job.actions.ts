"use server";

/**
 * One job with its status and result.
 *
 * GET /v1/jobs/{jobId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { EngineJob } from "#sdk/types/engine/job.ts";

export type GetJobInput = ActionInput<{ jobId: string }, never, never>;

export async function getJob(input: GetJobInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/jobs/${input.params.jobId}`;
  return api.get<EngineJob>(path, options);
}
