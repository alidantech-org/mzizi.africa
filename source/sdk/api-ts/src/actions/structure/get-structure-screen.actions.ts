"use server";

/**
 * Country governance structure with typed positions, offices, powers, procedures and responsibilities. Scope is explicitly national; missing records do not establish absence.
 *
 * GET /v1/structure
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { StructureStructureDocument } from "#sdk/types/structure/structure-document.ts";
import type { StructureStructureInput } from "#sdk/types/structure/structure-input.ts";

export type GetStructureScreenInput = ActionInput<never, StructureStructureInput, never>;

export async function getStructureScreen(input: GetStructureScreenInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/structure";
  return api.get<StructureStructureDocument>(path, options);
}
