"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { SourceEvidenceCollection } from "#sdk/types/source/dto/evidence-collection.ts";
import type { SourceRowEvidence } from "#sdk/types/source/dto/row-evidence.ts";
import type { SourceSourceCollection } from "#sdk/types/source/dto/source-collection.ts";
import type { SourceSourceWindow } from "#sdk/types/source/dto/source-window.ts";
/** GET /v1/source/evidence */
export type SourceListEvidenceActionInput = ActionInput<never, SourceRowEvidence, never>;

export async function sourceListEvidence(input: SourceListEvidenceActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.source.listEvidence;
  return api.get<SourceEvidenceCollection>(path, options);
}
/** GET /v1/source/sources */
export type SourceListSourcesActionInput = ActionInput<never, SourceSourceWindow, never>;

export async function sourceListSources(input: SourceListSourcesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.source.listSources;
  return api.get<SourceSourceCollection>(path, options);
}
