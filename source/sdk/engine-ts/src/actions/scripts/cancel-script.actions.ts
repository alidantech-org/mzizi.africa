"use server";

/**
 * Request cancellation of an active script.
 *
 * POST /v1/research/scripts/{jobId}/cancel
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ScriptsScriptJob } from "#sdk/types/scripts/script-job.ts";

export type CancelScriptInput = ActionInput<{ jobId: string }, never, never>;

export async function cancelScript(input: CancelScriptInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/research/scripts/${input.params.jobId}/cancel`;
  return api.post<ScriptsScriptJob>(path, undefined, options);
}
