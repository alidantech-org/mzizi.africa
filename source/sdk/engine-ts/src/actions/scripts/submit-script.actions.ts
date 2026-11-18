"use server";

/**
 * Start a bounded data transformation over verified artifacts.
 *
 * POST /v1/research/scripts
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
import type { ScriptsScriptJob } from "#sdk/types/scripts/script-job.ts";
import type { ScriptsScriptRequest } from "#sdk/types/scripts/script-request.ts";

export type SubmitScriptInput = ActionInput<never, never, ScriptsScriptRequest>;

export async function submitScript(input: SubmitScriptInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/research/scripts";
  return api.post<ScriptsScriptJob>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for submitScript. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function submitScriptAction(
  _previous: FormActionResult<ScriptsScriptRequest, ApiBridgeResponse<ScriptsScriptJob>> | null,
  data: FormData,
): Promise<FormActionResult<ScriptsScriptRequest, ApiBridgeResponse<ScriptsScriptJob>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<ScriptsScriptRequest>(data);
  const response = await submitScript({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
