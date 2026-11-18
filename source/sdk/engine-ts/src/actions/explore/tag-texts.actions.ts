"use server";

/**
 * Tag each text with the term groups it mentions.
 *
 * POST /v1/explore/terms/tag
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
import type { ExploreTagBody } from "#sdk/types/explore/tag-body.ts";
import type { ExploreTaggedList } from "#sdk/types/explore/tagged-list.ts";

export type TagTextsInput = ActionInput<never, never, ExploreTagBody>;

export async function tagTexts(input: TagTextsInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/explore/terms/tag";
  return api.post<ExploreTaggedList>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for tagTexts. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function tagTextsAction(
  _previous: FormActionResult<ExploreTagBody, ApiBridgeResponse<ExploreTaggedList>> | null,
  data: FormData,
): Promise<FormActionResult<ExploreTagBody, ApiBridgeResponse<ExploreTaggedList>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<ExploreTagBody>(data);
  const response = await tagTexts({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
