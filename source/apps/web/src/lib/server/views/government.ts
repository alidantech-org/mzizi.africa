import "server-only";
/** Screen reads for government: a country's institutions and one institution with its offices and holders. */
import { frontendGetInstitutionScreen } from "@mzizi/api-client/actions/frontend";
import { governanceListInstitutions } from "@mzizi/api-client/actions/governance";
import type { FrontendInstitutionScreen, GovernanceInstitutionCollection } from "@mzizi/api-client";
import { countryCode, languageCode } from "#/lib/server/codes";

export type Loaded<T> = { data: T | null; failed: boolean };
const cache = () => ({ caching: { revalidate: 600, tags: ["governance"] } });
export const pack = <T>(res: { success: boolean; body?: T | null }): Loaded<T> => ({ data: res.success ? (res.body ?? null) : null, failed: !res.success });

export const loadInstitutions = async (countryId: string): Promise<Loaded<GovernanceInstitutionCollection>> =>
  pack(await governanceListInstitutions({ query: { countryId, limit: 200, offset: 0 }, options: cache() }));

export const loadInstitution = async (country: string, institution: string, language: string): Promise<Loaded<FrontendInstitutionScreen>> =>
  pack(await frontendGetInstitutionScreen({ query: { country: countryCode(country), institution, lang: languageCode(language) }, options: cache() }));
