/** Readable URL addresses of named things; dated rows keep old addresses resolving. */
export interface IdentityAddresses {
  canonicalId?: string | null;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityId: string;
  languageId?: string | null;
  parentId?: string | null;
  sectionTerm?: string | null;
  segment: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
