"use server";

/**
 * The languages the system can serve names and labels in, for a language picker.
 *
 * GET /v1/languages
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { LocalityLanguageList } from "#sdk/types/locality/language-list.ts";

export type ListLanguagesInput = ActionInput<never, never, never>;

export async function listLanguages(input: ListLanguagesInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/languages";
  return api.get<LocalityLanguageList>(path, options);
}
