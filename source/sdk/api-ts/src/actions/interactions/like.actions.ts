"use server";

/**
 * This device likes a subject; liking twice changes nothing.
 *
 * POST /v1/likes
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

export type LikeInput = ActionInput<never, never, InteractionsLikeInput>;

export async function like(input: LikeInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/likes";
  return api.post<InteractionsEngagement>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for like. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function likeAction(
  _previous: FormActionResult<
    InteractionsLikeInput,
    ApiBridgeResponse<InteractionsEngagement>
  > | null,
  data: FormData,
): Promise<FormActionResult<InteractionsLikeInput, ApiBridgeResponse<InteractionsEngagement>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<InteractionsLikeInput>(data);
  const response = await like({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
