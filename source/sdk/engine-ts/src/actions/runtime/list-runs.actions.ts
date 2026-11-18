"use server";

/**
 * Recent runs, newest first, optionally by status.
 *
 * GET /v1/runs
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { RuntimeRunList } from "#sdk/types/runtime/run-list.ts";

export type ListRunsInput = ActionInput<never, { status?: string; limit?: number }, never>;

export async function listRuns(input: ListRunsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/runs";
  return api.get<RuntimeRunList>(path, options);
}
