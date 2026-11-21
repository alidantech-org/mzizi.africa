"use client";
/** Place catalogue loaded on the server from the generated client and handed to the existing location UI. */
import { createContext, useContext, type ReactNode } from "react";

import { registerFlags, type FlagColor } from "#/lib/preferences/flag-colors";

export type CatalogueLevel = { code: string; label: string };
export type CatalogueCountry = { code: string; iso: string; name: string; levels: string[]; levelDefs: CatalogueLevel[]; flagUrl: string | null; flagColors: FlagColor[]; /** True when the backend holds place data for it. */ served: boolean };
export type CatalogueEntry = { kind: string; name: string; where: string; href: string; tag?: string };
export type CatalogueLanguage = { code: string; name: string; nativeName: string | null };
export type PlaceCatalogue = {
  /** True when a country is in view (address or saved place), so place search can run. */
  searchable: boolean;
  /** Which navigation subjects have recorded data for the country in view; empty when no country is in view. */
  navigation: Record<string, boolean>;
  /** Interface languages the backend has wording for. */
  languages: CatalogueLanguage[];
  countries: CatalogueCountry[];
  entries: CatalogueEntry[];
  /** Server-side search result for the `find` query parameter; null when nothing was searched. */
  found: { query: string; kind: string | null; page: number; limit: number; total: number; entries: CatalogueEntry[] } | null;
  /** Recorded limits of what was loaded, shown rather than hidden. */
  gaps: string[];
};

const EMPTY: PlaceCatalogue = { searchable: false, navigation: {}, languages: [], countries: [], entries: [], found: null, gaps: [] };
const Ctx = createContext<PlaceCatalogue>(EMPTY);

export function PlaceCatalogueProvider({ value, children }: { value: PlaceCatalogue; children: ReactNode }) {
  registerFlags(value.countries);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const usePlaceCatalogue = () => useContext(Ctx);

const slugName = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/** Names of places for the current language, from the server-loaded catalogue. A place not in it shows its address segment. */
export function usePlaceNames() {
  const { countries, entries } = usePlaceCatalogue();
  const byHref = new Map(entries.map((e) => [e.href, e.name]));
  const countryName = (code: string) => countries.find((c) => c.code === code)?.name ?? code.toUpperCase();
  const nameOf = (place: { country: string; trail: string[] }) =>
    place.trail.length
      ? (byHref.get(`/${[place.country, ...place.trail].join("/")}`) ?? slugName(place.trail.at(-1) ?? ""))
      : countryName(place.country);
  /** Country and the places above this one, outermost first. */
  const parentsOf = (place: { country: string; trail: string[] }) => [
    countryName(place.country),
    ...place.trail.slice(0, -1).map((_, i) => nameOf({ country: place.country, trail: place.trail.slice(0, i + 1) })),
  ];
  /** Name of a level of the country: 0 is the country itself. Undefined where the backend has not named it. */
  const levelOf = (country: string, depth: number) => countries.find((c) => c.code === country)?.levels[depth - 1];
  return { countryName, nameOf, parentsOf, levelOf };
}
