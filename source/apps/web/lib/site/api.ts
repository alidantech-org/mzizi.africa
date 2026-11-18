/**
 * The locality reads the pages make, through the generated server actions (the browser never calls the API). Each
 * returns the body or throws the API's message, so a page has one place to show an error.
 */
import { browseSources } from "@mzizi/api-client/actions/locality/browse-sources.actions.ts";
import { getEvidence } from "@mzizi/api-client/actions/locality/get-evidence.actions.ts";
import { getLocality } from "@mzizi/api-client/actions/locality/get-locality.actions.ts";
import { resolveLocality } from "@mzizi/api-client/actions/locality/resolve-locality.actions.ts";
import { searchLocalities } from "@mzizi/api-client/actions/locality/search-localities.actions.ts";
import type { EvidenceDetail } from "#/lib/types/evidence-detail.ts";
import type { LocalityMatches } from "#/lib/types/locality-matches.ts";
import type { LocalityProfile } from "#/lib/types/locality-profile.ts";
import type { SourceCollection } from "#/lib/types/source-collection.ts";

interface Outcome<T> { readonly success: boolean; readonly body: T | null; readonly message?: string }

async function body<T>(pending: Promise<Outcome<T>>): Promise<T> {
  const response = await pending;
  if (!response.success || response.body === null) {
    const detail = (response.body as { message?: string } | null)?.message;
    throw new Error(detail ?? response.message ?? "This information could not be loaded.");
  }
  return response.body;
}

export const profileAt = (latitude: number, longitude: number, languageCode: string): Promise<LocalityProfile> =>
  body(resolveLocality({ query: { latitude, longitude, languageCode } }) as Promise<Outcome<LocalityProfile>>);
export const profileOf = (featureId: string, languageCode: string): Promise<LocalityProfile> =>
  body(getLocality({ params: { featureId }, query: { languageCode } }) as Promise<Outcome<LocalityProfile>>);
export const findPlaces = (query: string, languageCode: string): Promise<LocalityMatches> =>
  body(searchLocalities({ query: { query, languageCode } }) as Promise<Outcome<LocalityMatches>>);
export const listSources = (query: string): Promise<SourceCollection> =>
  body(browseSources({ query: query === "" ? {} : { query } }) as Promise<Outcome<SourceCollection>>);
export const evidenceOf = (citationId: string): Promise<EvidenceDetail> =>
  body(getEvidence({ params: { citationId } }) as Promise<Outcome<EvidenceDetail>>);
