"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { LocalityEvidenceDetail } from "#sdk/types/locality/dto/evidence-detail.ts";
import type { LocalityLanguageList } from "#sdk/types/locality/dto/language-list.ts";
import type { LocalityLocalityMatches } from "#sdk/types/locality/dto/locality-matches.ts";
import type { LocalityLocalityProfile } from "#sdk/types/locality/dto/locality-profile.ts";
import type { LocalityPositionInput } from "#sdk/types/locality/dto/position-input.ts";
import type { LocalitySearchInput } from "#sdk/types/locality/dto/search-input.ts";
import type { LocalitySourceCollection } from "#sdk/types/locality/dto/source-collection.ts";
import type { LocalitySourceSearchInput } from "#sdk/types/locality/dto/source-search-input.ts";
/** GET /v1/sources */
export type LocalityBrowseSourcesActionInput = ActionInput<never, LocalitySourceSearchInput, never>;

export async function localityBrowseSources(input: LocalityBrowseSourcesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.locality.browseSources;
  return api.get<LocalitySourceCollection>(path, options);
}
/** GET /v1/evidence/{citationId} */
export type LocalityGetEvidenceActionInput = ActionInput<{ citationId: string }, never, never>;

export async function localityGetEvidence(input: LocalityGetEvidenceActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.locality.getEvidence(input.params);
  return api.get<LocalityEvidenceDetail>(path, options);
}
/** GET /v1/locality/{featureId} */
export type LocalityGetLocalityActionInput = ActionInput<
  { featureId: string },
  { languageCode?: string },
  never
>;

export async function localityGetLocality(input: LocalityGetLocalityActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.locality.getLocality(input.params);
  return api.get<LocalityLocalityProfile>(path, options);
}
/** GET /v1/languages */
export type LocalityListLanguagesActionInput = ActionInput<never, never, never>;

export async function localityListLanguages(input: LocalityListLanguagesActionInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.locality.listLanguages;
  return api.get<LocalityLanguageList>(path, options);
}
/** GET /v1/locality/at */
export type LocalityResolveLocalityActionInput = ActionInput<never, LocalityPositionInput, never>;

export async function localityResolveLocality(input: LocalityResolveLocalityActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.locality.resolveLocality;
  return api.get<LocalityLocalityProfile>(path, options);
}
/** GET /v1/locality/search */
export type LocalitySearchLocalitiesActionInput = ActionInput<never, LocalitySearchInput, never>;

export async function localitySearchLocalities(input: LocalitySearchLocalitiesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.locality.searchLocalities;
  return api.get<LocalityLocalityMatches>(path, options);
}
