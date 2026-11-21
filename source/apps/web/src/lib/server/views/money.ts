import "server-only";
/** Reads for the money views: civic delivery of a place (funds, spending, projects) and public tenders. */
import { insightsGetPlaceCivicAt, insightsListTenders } from "@mzizi/api-client/actions/insights";
import type { InsightsPlaceCivic, InsightsTenderList } from "@mzizi/api-client";
import { pack, type Loaded } from "#/lib/server/views/government";
import type { PlaceAddress } from "#/lib/server/views/place-home";

const cache = () => ({ caching: { revalidate: 600, tags: ["money"] } });

export const loadCivic = async (a: PlaceAddress, languageCode: string): Promise<Loaded<InsightsPlaceCivic>> =>
  pack(await insightsGetPlaceCivicAt({ query: { countryCode: a.country.toUpperCase(), path: a.trail.length ? a.trail.join("/") : undefined, languageCode }, options: cache() }));

export const loadTenders = async (status?: string): Promise<Loaded<InsightsTenderList>> =>
  pack(await insightsListTenders({ query: { status: status || undefined, limit: 100 }, options: cache() }));
