"use server";

/**
 * This device withdraws its like.
 *
 * POST /v1/likes/remove
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
import type { InteractionsEngagement } from "#sdk/types/interactions/engagement.ts";
import type { InteractionsLikeInput } from "#sdk/types/interactions/like-input.ts";

export type UnlikeInput = ActionInput<never, never, InteractionsLikeInput>;

export async function unlike(input: UnlikeInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/likes/remove";
  return api.post<InteractionsEngagement>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for unlike. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function unlikeAction(
  _previous: FormActionResult<
    InteractionsLikeInput,
    ApiBridgeResponse<InteractionsEngagement>
  > | null,
  data: FormData,
): Promise<FormActionResult<InteractionsLikeInput, ApiBridgeResponse<InteractionsEngagement>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<InteractionsLikeInput>(data);
  const response = await unlike({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
