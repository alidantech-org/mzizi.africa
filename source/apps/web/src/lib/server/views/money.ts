import "server-only";
/** Screen reads for money: projects that touch a place and a country's tenders. */
import { civicListPlaceProjects, civicListTenders } from "@mzizi/api-client/actions/civic";
import type { CivicProjectCollection, CivicTenderCollection } from "@mzizi/api-client";
import { pack, type Loaded } from "#/lib/server/views/government";

const cache = () => ({ caching: { revalidate: 600, tags: ["civic"] } });

export const loadProjects = async (featureId: string): Promise<Loaded<CivicProjectCollection>> =>
  pack(await civicListPlaceProjects({ query: { featureId, limit: 50, offset: 0 }, options: cache() }));

export const loadTenders = async (countryId: string): Promise<Loaded<CivicTenderCollection>> =>
  pack(await civicListTenders({ query: { countryId, limit: 50, offset: 0 }, options: cache() }));
