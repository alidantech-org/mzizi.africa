"use server";

/**
 * Preview (or save, when save_as is set) a cleaned copy of a CSV.
 *
 * POST /v1/explore/csv/prepare
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
import type { ExplorePrepareRequest } from "#sdk/types/explore/prepare-request.ts";
import type { ExplorePrepareResult } from "#sdk/types/explore/prepare-result.ts";

export type PrepareCsvInput = ActionInput<never, never, ExplorePrepareRequest>;

export async function prepareCsv(input: PrepareCsvInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/explore/csv/prepare";
  return api.post<ExplorePrepareResult>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for prepareCsv. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function prepareCsvAction(
  _previous: FormActionResult<
    ExplorePrepareRequest,
    ApiBridgeResponse<ExplorePrepareResult>
  > | null,
  data: FormData,
): Promise<FormActionResult<ExplorePrepareRequest, ApiBridgeResponse<ExplorePrepareResult>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<ExplorePrepareRequest>(data);
  const response = await prepareCsv({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
