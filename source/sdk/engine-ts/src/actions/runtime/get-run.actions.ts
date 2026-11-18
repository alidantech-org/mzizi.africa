"use server";

/**
 * One run with its status and the jobs it started.
 *
 * GET /v1/runs/{runId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { RuntimeRun } from "#sdk/types/runtime/run.ts";

export type GetRunInput = ActionInput<{ runId: string }, never, never>;

export async function getRun(input: GetRunInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/runs/${input.params.runId}`;
  return api.get<RuntimeRun>(path, options);
}
