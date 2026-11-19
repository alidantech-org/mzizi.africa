"use server";

/**
 * A subject was viewed; one view per visitor per day.
 *
 * POST /v1/views
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
import type { InteractionsRecorded } from "#sdk/types/interactions/recorded.ts";
import type { InteractionsViewInput } from "#sdk/types/interactions/view-input.ts";

export type RecordViewInput = ActionInput<never, never, InteractionsViewInput>;

export async function recordView(input: RecordViewInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/views";
  return api.post<InteractionsRecorded>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for recordView. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function recordViewAction(
  _previous: FormActionResult<
    InteractionsViewInput,
    ApiBridgeResponse<InteractionsRecorded>
  > | null,
  data: FormData,
): Promise<FormActionResult<InteractionsViewInput, ApiBridgeResponse<InteractionsRecorded>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<InteractionsViewInput>(data);
  const response = await recordView({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
