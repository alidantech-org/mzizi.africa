"use server";

/**
 * One job with its event timeline and the folder it wrote.
 *
 * GET /v1/explore/jobs/{jobId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExploreJobDetail } from "#sdk/types/explore/job-detail.ts";

export type GetJobDetailInput = ActionInput<{ jobId: string }, never, never>;

export async function getJobDetail(input: GetJobDetailInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/explore/jobs/${input.params.jobId}`;
  return api.get<ExploreJobDetail>(path, options);
}
