"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import {
  type ActionInput,
  requestOptions,
  cleanActionFormData,
  formActionRedirectPath,
  type FormActionResult,
} from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { ApiBridgeResponse } from "next-api-bridge";
import { redirect } from "next/navigation";
import type { CommunityIdentityPosts } from "#sdk/types/community/dto/identity-posts.ts";
import type { CommunityPostCollection } from "#sdk/types/community/dto/post-collection.ts";
import type { CommunityRecorded } from "#sdk/types/community/dto/recorded.ts";
import type { CommunityViewInput } from "#sdk/types/community/dto/view-input.ts";
/** GET /v1/community/posts */
export type CommunityListPostsActionInput = ActionInput<never, CommunityIdentityPosts, never>;

export async function communityListPosts(input: CommunityListPostsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.community.listPosts;
  return api.get<CommunityPostCollection>(path, options);
}
/** POST /v1/community/views */
export type CommunityRecordViewActionInput = ActionInput<never, never, CommunityViewInput>;

export async function communityRecordView(input: CommunityRecordViewActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.community.recordView;
  return api.post<CommunityRecorded>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for communityRecordView. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function communityRecordViewAction(
  _previous: FormActionResult<CommunityViewInput, ApiBridgeResponse<CommunityRecorded>> | null,
  data: FormData,
): Promise<FormActionResult<CommunityViewInput, ApiBridgeResponse<CommunityRecorded>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<CommunityViewInput>(data);
  const response = await communityRecordView({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
