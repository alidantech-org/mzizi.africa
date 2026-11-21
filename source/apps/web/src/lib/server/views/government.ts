import "server-only";
/** Reads for the government views: public institutions and legal instruments. Both are country-wide records held for Kenya. */
import { insightsGetInstitution, insightsListInstitutions, insightsListLaw } from "@mzizi/api-client/actions/insights";
import type { InsightsInstitutionDetail, InsightsInstitutionList, InsightsLawList } from "@mzizi/api-client";

const cache = () => ({ caching: { revalidate: 600, tags: ["government"] } });
export type Loaded<T> = { data: T | null; failed: boolean };
/**
 * The generated TypeScript types name fields in camel case, but some contract fields (held_on, moved_by, ...) are
 * written in snake case on the wire, because the Flutter app reads them that way. Until the generator maps names, the
 * keys are converted here, in one place, so the rest of the web app can trust the generated types.
 */
const camel = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(camel)
    : v && typeof v === "object"
      ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()), camel(x)]))
      : v;
export const pack = <T>(res: { success: boolean; body?: T | null }): Loaded<T> =>
  res.success && res.body ? { data: camel(res.body) as T, failed: false } : { data: null, failed: true };

export const loadInstitutions = async (): Promise<Loaded<InsightsInstitutionList>> => pack(await insightsListInstitutions({ options: cache() }));
export const loadInstitution = async (code: string): Promise<Loaded<InsightsInstitutionDetail>> =>
  pack(await insightsGetInstitution({ params: { code }, options: cache() }));
export const loadLaw = async (): Promise<Loaded<InsightsLawList>> => pack(await insightsListLaw({ options: cache() }));

import { insightsGetMotion, insightsListElections, insightsListMotions } from "@mzizi/api-client/actions/insights";
import type { InsightsElectionList, InsightsMotionDetail, InsightsMotionList } from "@mzizi/api-client";

export const loadMotions = async (): Promise<Loaded<InsightsMotionList>> => pack(await insightsListMotions({ query: { limit: 50 }, options: cache() }));
export const loadMotion = async (code: string): Promise<Loaded<InsightsMotionDetail>> =>
  pack(await insightsGetMotion({ params: { code }, options: cache() }));
export const loadElections = async (): Promise<Loaded<InsightsElectionList>> => pack(await insightsListElections({ options: cache() }));
