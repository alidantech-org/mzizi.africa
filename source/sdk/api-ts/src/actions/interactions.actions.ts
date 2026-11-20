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
import type { InteractionsEngagementInput } from "#sdk/types/interactions/dto/engagement-input.ts";
import type { InteractionsEngagement } from "#sdk/types/interactions/dto/engagement.ts";
import type { InteractionsLikeInput } from "#sdk/types/interactions/dto/like-input.ts";
import type { InteractionsRecorded } from "#sdk/types/interactions/dto/recorded.ts";
import type { InteractionsViewInput } from "#sdk/types/interactions/dto/view-input.ts";
/** GET /v1/engagement */
export type InteractionsGetEngagementActionInput = ActionInput<
  never,
  InteractionsEngagementInput,
  never
>;

export async function interactionsGetEngagement(input: InteractionsGetEngagementActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.interactions.getEngagement;
  return api.get<InteractionsEngagement>(path, options);
}
/** POST /v1/likes */
export type InteractionsLikeActionInput = ActionInput<never, never, InteractionsLikeInput>;

export async function interactionsLike(input: InteractionsLikeActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.interactions.like;
  return api.post<InteractionsEngagement>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for interactionsLike. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function interactionsLikeAction(
  _previous: FormActionResult<
    InteractionsLikeInput,
    ApiBridgeResponse<InteractionsEngagement>
  > | null,
  data: FormData,
): Promise<FormActionResult<InteractionsLikeInput, ApiBridgeResponse<InteractionsEngagement>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<InteractionsLikeInput>(data);
  const response = await interactionsLike({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
/** POST /v1/views */
export type InteractionsRecordViewActionInput = ActionInput<never, never, InteractionsViewInput>;

export async function interactionsRecordView(input: InteractionsRecordViewActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.interactions.recordView;
  return api.post<InteractionsRecorded>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for interactionsRecordView. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function interactionsRecordViewAction(
  _previous: FormActionResult<
    InteractionsViewInput,
    ApiBridgeResponse<InteractionsRecorded>
  > | null,
  data: FormData,
): Promise<FormActionResult<InteractionsViewInput, ApiBridgeResponse<InteractionsRecorded>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<InteractionsViewInput>(data);
  const response = await interactionsRecordView({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
/** POST /v1/likes/remove */
export type InteractionsUnlikeActionInput = ActionInput<never, never, InteractionsLikeInput>;

export async function interactionsUnlike(input: InteractionsUnlikeActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.interactions.unlike;
  return api.post<InteractionsEngagement>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for interactionsUnlike. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function interactionsUnlikeAction(
  _previous: FormActionResult<
    InteractionsLikeInput,
    ApiBridgeResponse<InteractionsEngagement>
  > | null,
  data: FormData,
): Promise<FormActionResult<InteractionsLikeInput, ApiBridgeResponse<InteractionsEngagement>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<InteractionsLikeInput>(data);
  const response = await interactionsUnlike({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
