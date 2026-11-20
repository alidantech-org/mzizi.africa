"use client";
/** Place catalogue loaded on the server from the generated client and handed to the existing location UI. */
import { createContext, useContext, type ReactNode } from "react";

export type CatalogueCountry = { code: string; iso: string; name: string; levels: string[]; /** True when the backend holds place data for it. */ served: boolean };
export type CatalogueEntry = { kind: string; name: string; where: string; href: string; tag?: string };
export type PlaceCatalogue = {
  countries: CatalogueCountry[];
  entries: CatalogueEntry[];
  /** Server-side search result for the `find` query parameter; null when nothing was searched. */
  found: { query: string; entries: CatalogueEntry[]; total: number } | null;
  /** Recorded limits of what was loaded, shown rather than hidden. */
  gaps: string[];
};

const EMPTY: PlaceCatalogue = { countries: [], entries: [], found: null, gaps: [] };
const Ctx = createContext<PlaceCatalogue>(EMPTY);

export function PlaceCatalogueProvider({ value, children }: { value: PlaceCatalogue; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const usePlaceCatalogue = () => useContext(Ctx);
