"use server";

/**
 * Read the current script state and recorded output.
 *
 * GET /v1/research/scripts/{jobId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ScriptsScriptJob } from "#sdk/types/scripts/script-job.ts";

export type GetScriptInput = ActionInput<{ jobId: string }, never, never>;

export async function getScript(input: GetScriptInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/research/scripts/${input.params.jobId}`;
  return api.get<ScriptsScriptJob>(path, options);
}
