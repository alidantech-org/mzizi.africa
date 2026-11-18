"use server";

/**
 * Save a text file under the dev root (never outside it).
 *
 * PUT /v1/explore/file
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
import type { ExploreSaveFileBody } from "#sdk/types/explore/save-file-body.ts";
import type { ExploreSaveFileResult } from "#sdk/types/explore/save-file-result.ts";

export type SaveFileInput = ActionInput<never, never, ExploreSaveFileBody>;

export async function saveFile(input: SaveFileInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/explore/file";
  return api.put<ExploreSaveFileResult>(path, input.body, options);
}

/**
 * useActionState-compatible wrapper for saveFile. Cleans FormData controls, calls the
 * operation, and redirects on success when the form posts __redirect_path.
 */
export async function saveFileAction(
  _previous: FormActionResult<ExploreSaveFileBody, ApiBridgeResponse<ExploreSaveFileResult>> | null,
  data: FormData,
): Promise<FormActionResult<ExploreSaveFileBody, ApiBridgeResponse<ExploreSaveFileResult>>> {
  const redirectPath = formActionRedirectPath(data);
  const body = cleanActionFormData<ExploreSaveFileBody>(data);
  const response = await saveFile({
    body,
    options: {},
  });
  if (response.success && redirectPath) redirect(redirectPath);
  return { response, formdata: body };
}
