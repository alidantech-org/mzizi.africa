"use server";

/**
 * Explicit country identity and recorded routing roots; no default-country inference.
 *
 * GET /v1/structure/context
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { StructureCountryContextDocument } from "#sdk/types/structure/country-context-document.ts";
import type { StructureStructureInput } from "#sdk/types/structure/structure-input.ts";

export type GetCountryContextInput = ActionInput<never, StructureStructureInput, never>;

export async function getCountryContext(input: GetCountryContextInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/structure/context";
  return api.get<StructureCountryContextDocument>(path, options);
}
