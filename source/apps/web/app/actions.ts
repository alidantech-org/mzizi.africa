"use server";

/** Place search for the sidebar switcher: matches come from the generated SDK, each with the clean path of the place. */
import { searchLocalities } from "@mzizi/api-client/actions/locality/search-localities.actions.ts";
import { getContext } from "@mzizi/api-client/actions/experience/get-context.actions.ts";

export interface PlaceChoice {
  readonly name: string;
  readonly kind: string;
  readonly path: string;
}

export async function findPlaces(query: string, languageCode: string): Promise<PlaceChoice[]> {
  if (query.trim().length < 2) return [];
  const found = await searchLocalities({ query: { query, languageCode } });
  const places = found.success && found.body ? found.body.places.slice(0, 8) : [];
  const resolved = await Promise.all(
    places.map(async (place) => {
      const context = await getContext({ query: { featureId: place.featureId, languageCode } });
      const ref = context.success ? context.body?.place : null;
      return ref ? { name: ref.name, kind: ref.kindLabel, path: ref.path } : null;
    }),
  );
  return resolved.filter((item): item is PlaceChoice => item !== null);
}
