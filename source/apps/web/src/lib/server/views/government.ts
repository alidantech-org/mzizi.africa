import "server-only";
/** Reads for the government views: public institutions and legal instruments. Both are country-wide records held for Kenya. */
import { insightsGetInstitution, insightsListInstitutions, insightsListLaw } from "@mzizi/api-client/actions/insights";
import type { InsightsInstitutionDetail, InsightsInstitutionList, InsightsLawList } from "@mzizi/api-client";

const cache = () => ({ caching: { revalidate: 600, tags: ["government"] } });
export type Loaded<T> = { data: T | null; failed: boolean };
const pack = <T>(res: { success: boolean; body?: T | null }): Loaded<T> =>
  res.success && res.body ? { data: res.body, failed: false } : { data: null, failed: true };

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
