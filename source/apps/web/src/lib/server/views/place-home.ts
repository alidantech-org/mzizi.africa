import "server-only";
/** Screen reads for a place: one call to the frontend place screen and the map outlines of its divisions. */
import { frontendGetPlaceScreen, frontendGetRankingScreen } from "@mzizi/api-client/actions/frontend";
import { geographyListChildOutlines } from "@mzizi/api-client/actions/geography";
import type { FrontendPlaceScreen, FrontendRankingScreen } from "@mzizi/api-client";
import { countryCode, languageCode, placeCode, type PlaceAddress } from "#/lib/server/codes";
import { readArea, type Area } from "#/lib/server/parse/geojson";

export type { PlaceAddress } from "#/lib/server/codes";
export type Loaded<T> = { data: T | null; failed: boolean };
const placeCache = () => ({ caching: { revalidate: 600, tags: ["places"] } });

export async function loadPlace(a: PlaceAddress, language: string): Promise<Loaded<FrontendPlaceScreen>> {
  const res = await frontendGetPlaceScreen({
    query: { country: countryCode(a.country), place: a.trail.length ? placeCode(a) : undefined, lang: languageCode(language) },
    options: placeCache(),
  });
  return { data: res.success ? (res.body ?? null) : null, failed: !res.success };
}

export async function loadRanking(country: string, indicator: string, language: string): Promise<Loaded<FrontendRankingScreen>> {
  const res = await frontendGetRankingScreen({ query: { country: countryCode(country), indicator, lang: languageCode(language) }, options: placeCache() });
  return { data: res.success ? (res.body ?? null) : null, failed: !res.success };
}

/** Outlines of the divisions inside a place for one zoom band (0 coarse to 3 fine), as GeoJSON geometries. */
export async function loadMap(parentId: string, band: number) {
  const res = await geographyListChildOutlines({ query: { parentId, limit: 200, offset: 0 }, options: placeCache() });
  if (!res.success || !res.body) return null;
  const unique = [...new Map(res.body.children.map((c) => [c.code, c])).values()];
  return unique.flatMap((c): { code: string; area: Area }[] => {
    const outline = c.outlines.find((o) => o.band === band) ?? c.outlines[0];
    const area = outline ? readArea(outline) : null;
    return area ? [{ code: c.code, area }] : [];
  });
}
