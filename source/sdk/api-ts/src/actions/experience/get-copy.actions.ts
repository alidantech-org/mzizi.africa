"use server";

/**
 * The interface wording for one language, with the country's own wording where it differs. Screens declare copy keys; the words are delivered from here.
 *
 * GET /v1/copy
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExperienceCopyCatalog } from "#sdk/types/experience/copy-catalog.ts";
import type { ExperienceCopyInput } from "#sdk/types/experience/copy-input.ts";

export type GetCopyInput = ActionInput<never, ExperienceCopyInput, never>;

export async function getCopy(input: GetCopyInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/copy";
  return api.get<ExperienceCopyCatalog>(path, options);
}
