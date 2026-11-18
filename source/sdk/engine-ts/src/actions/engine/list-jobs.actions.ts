"use server";

/**
 * Recent jobs, newest first, optionally by status.
 *
 * GET /v1/jobs
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { EngineJobList } from "#sdk/types/engine/job-list.ts";

export type ListJobsInput = ActionInput<never, { status?: string; limit?: number }, never>;

export async function listJobs(input: ListJobsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/jobs";
  return api.get<EngineJobList>(path, options);
}
