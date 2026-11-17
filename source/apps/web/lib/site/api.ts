/**
 * The reads the pages make, over the Dryv-generated request builders. Each returns the body or throws the API's
 * message, so a page has one place to show an error.
 */
import { getEvidence, getEvidenceRequest } from "#/lib/api/locality/get-evidence.ts";
import { getLocality, getLocalityRequest } from "#/lib/api/locality/get-locality.ts";
import { browseSources, browseSourcesRequest } from "#/lib/api/locality/browse-sources.ts";
import { resolveLocality, resolveLocalityRequest } from "#/lib/api/locality/resolve-locality.ts";
import { searchLocalities, searchLocalitiesRequest } from "#/lib/api/locality/search-localities.ts";
import type { ClientResponse } from "#/lib/dryv/transport.ts";
import type { EvidenceDetail } from "#/lib/types/evidence-detail.ts";
import type { LocalityMatches } from "#/lib/types/locality-matches.ts";
import type { LocalityProfile } from "#/lib/types/locality-profile.ts";
import type { SourceCollection } from "#/lib/types/source-collection.ts";

async function body<T>(pending: Promise<ClientResponse<T>>): Promise<T> {
  const response = await pending;
  if (!response.success || response.body === null) {
    const detail = (response.body as { message?: string } | null)?.message;
    throw new Error(detail ?? response.message);
  }
  return response.body;
}

export const profileAt = (
  latitude: number,
  longitude: number,
  languageCode: string,
): Promise<LocalityProfile> =>
  body(resolveLocality(resolveLocalityRequest({ input: { latitude, longitude, languageCode } })));

export const profileOf = (featureId: string, languageCode: string): Promise<LocalityProfile> =>
  body(getLocality(getLocalityRequest({ featureId, input: { featureId, languageCode } })));

export const findPlaces = (query: string, languageCode: string): Promise<LocalityMatches> =>
  body(searchLocalities(searchLocalitiesRequest({ input: { query, languageCode } })));

export const listSources = (query: string): Promise<SourceCollection> =>
  body(browseSources(browseSourcesRequest({ input: query === "" ? {} : { query } })));

export const evidenceOf = (citationId: string): Promise<EvidenceDetail> =>
  body(getEvidence(getEvidenceRequest({ citationId })));
