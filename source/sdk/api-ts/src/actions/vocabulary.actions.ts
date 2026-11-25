"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { VocabularySchemeDetail } from "#sdk/types/vocabulary/dto/scheme-detail.ts";
import type { VocabularyTermCollection } from "#sdk/types/vocabulary/dto/term-collection.ts";
import type { VocabularyTermWindow } from "#sdk/types/vocabulary/dto/term-window.ts";
/** GET /v1/vocabulary/schemes/{code} */
export type VocabularyGetSchemeActionInput = ActionInput<{ code: string }, never, never>;

export async function vocabularyGetScheme(input: VocabularyGetSchemeActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.vocabulary.getScheme(input.params);
  return api.get<VocabularySchemeDetail>(path, options);
}
/** GET /v1/vocabulary/terms */
export type VocabularyListTermsActionInput = ActionInput<never, VocabularyTermWindow, never>;

export async function vocabularyListTerms(input: VocabularyListTermsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.vocabulary.listTerms;
  return api.get<VocabularyTermCollection>(path, options);
}
