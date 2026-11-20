"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { StructureCountryContextDocument } from "#sdk/types/structure/dto/country-context-document.ts";
import type { StructureStructureDocument } from "#sdk/types/structure/dto/structure-document.ts";
import type { StructureStructureInput } from "#sdk/types/structure/dto/structure-input.ts";
/** GET /v1/structure/context */
export type StructureGetCountryContextActionInput = ActionInput<
  never,
  StructureStructureInput,
  never
>;

export async function structureGetCountryContext(input: StructureGetCountryContextActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.structure.getCountryContext;
  return api.get<StructureCountryContextDocument>(path, options);
}
/** GET /v1/structure */
export type StructureGetStructureScreenActionInput = ActionInput<
  never,
  StructureStructureInput,
  never
>;

export async function structureGetStructureScreen(input: StructureGetStructureScreenActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.structure.getStructureScreen;
  return api.get<StructureStructureDocument>(path, options);
}
